// https://nuxt.com/docs/api/configuration/nuxt-config
import {fa} from "cronstrue/dist/i18n/locales/fa";

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: ["~/assets/css/main.scss"],
  app: {
    head: {
      title: 'Bloggplatform',
      chartset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'nb'
      },
      meta: [
        { name: 'description', content: 'En bloggplatform for håndverk' }
      ]
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./assets/css/variables.scss";',
        },
      },
    },
    server: {
      fs: {
        strict: false,
      },
    },
  },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
  },
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage'
  },
  runtimeConfig: {
    private: {
      cosmosEndpoint: '',
      cosmosKey: '',
      cosmosDatabaseId: '',
      cosmosContainerId: ''
    },
  },
});
