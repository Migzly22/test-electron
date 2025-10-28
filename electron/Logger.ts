import * as fs from 'fs';
import { app } from 'electron';
import * as path from 'path';

const logFile = path.join(app.getPath('userData'), 'debug.log');

export const mainLogger = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
  console.log(message);
}

// Use log() instead of console.log()
mainLogger('App starting...');
mainLogger('App path: ' + app.getAppPath());
mainLogger('Resources path: ' + process.resourcesPath);
mainLogger('Is packaged: ' + app.isPackaged);