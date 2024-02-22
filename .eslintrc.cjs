module.exports = {
  root: true,
  extends: [
    "@nuxt/eslint-config",
    "plugin:perfectionist/recommended-natural",
    "prettier",
  ],
  plugins: ["perfectionist"],
  rules: {
    "perfectionist/sort-objects": "off",
    "perfectionist/sort-jsx-props": "off",
    "perfectionist/sort-vue-attributes": "off",
    "perfectionist/sort-svelte-attributes": "off",
    "perfectionist/sort-astro-attributes": "off",
  },
};
