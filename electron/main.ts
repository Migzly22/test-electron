import { app, BrowserWindow } from 'electron';
import  path  from 'path'
import { mainLogger } from './Logger';
import { pathToFileURL } from 'url';

const appPath = app.getAppPath();
const isProd =  app.isPackaged
const location = isProd ? process.resourcesPath : appPath

let nitroServer: any = null;

const startWebServer = async () => {
  try {
    // Path to the Nuxt server output
    const modulePath = path.join(location,'app.asar','.output', 'server', 'index.mjs');
    
    // Convert file path to URL format for dynamic import
    const moduleUrl = pathToFileURL(modulePath).href;
    
    // Dynamically import the server module
    // The default export is 'nodeServer' - a Nitro node server handler
    const { default: nodeServer } = await import(moduleUrl);
    
    // If nodeServer is a function, call it to start the server
    // Otherwise, just importing it should have started the server
    if (typeof nodeServer === 'function') {
      const server = await nodeServer();
      mainLogger('Nuxt SSR server started successfully');
      nitroServer = server
      return nitroServer;
    } else {
      mainLogger('Nuxt SSR server loaded (auto-started on import)');
      return nodeServer;
    }
  } catch (error) {
    console.error('Failed to start web server:', error);
    throw error;
  }
}

const stopWebServer = async () => {
  if (nitroServer) {
    try {
      if (typeof nitroServer.close === 'function') {
        await new Promise((resolve, reject) => {
          nitroServer.close((err: any) => {
            if (err) reject(err);
            else resolve(undefined);
          });
        });
        mainLogger('Nuxt SSR server stopped');
      }
    } catch (error) {
      console.error('Error stopping web server:', error);
    } finally {
      nitroServer = null;
    }
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopWebServer().then(() => app.quit());
  }
});

const createWindow = () => {
//   const preloadPath = path.join(location, 'dist-electron', 'preload.js')
  
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar : true,
    webPreferences: {
    //   preload: preloadPath,
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false, // Required for preload to work properly
    },
  });
  
  
      const url = `http://localhost:${3000}`
      mainLogger(url)
      win.loadURL(url);
  // if (isProd) {
  //   const filePath = path.join(location,'app.asar', '.output', 'public', 'index.html')
  //   mainLogger(filePath)
  //   win.loadFile(filePath)
  // }else {
  //   const url = process.env.NUXT_PUBLIC_APP_URL && !process.env.NUXT_PUBLIC_APP_URL.includes('undefined')
  //     ? process.env.NUXT_PUBLIC_APP_URL
  //     : `http://localhost:${process.env.PORT || 3000}`;
  //   mainLogger(url)
  //   win.loadURL(url);
  //   win.webContents.openDevTools()
  // }


  // Keyboard shortcut to toggle DevTools
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      win.webContents.toggleDevTools();
    }
  });
};

app.whenReady().then(async() => {
  await startWebServer()
  createWindow();
});

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });