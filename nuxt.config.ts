// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['nuxt-electron'],
  router: {
    options: {
      hashMode: true,
    },
  },
  app: {
    baseURL: './',
    buildAssetsDir: '/_nuxt/',
    cdnURL: '.',
  },
  ssr: false,
  vite: {
    server: {
      middlewareMode: false,
    },
    build: {
      rollupOptions: {
        external: ['@ccci/micro-server']
      }
    },
    optimizeDeps: {
      exclude: ['@ccci/micro-server']
    }
  },
  electron: {
    build: [
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
      },
      
    ],
    disableDefaultOptions:  true,
  },
})
