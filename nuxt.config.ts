// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  imports: {
    dirs: ["services"],
  },
  modules: ["@nuxt/ui", "@nuxt/eslint"],
});
