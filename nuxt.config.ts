// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-08-07",
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  imports: {
    dirs: ["services"],
  },
  modules: ["@nuxt/ui", "@nuxt/eslint"],
});
