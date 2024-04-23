// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: ["~/assets/css/main.scss"],
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
  runtimeConfig: {
    private: {
      cosmosEndpoint: '',
      cosmosKey: '',
      cosmosDatabaseId: '',
      cosmosContainerId: ''
    },
  },
});
