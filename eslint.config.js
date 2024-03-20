import eslintConfigPrettier from "eslint-config-prettier";
import perfectionistNatural from "eslint-plugin-perfectionist/configs/recommended-natural";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

import nuxt from "./.nuxt/eslint.config.mjs";

export default [
  ...nuxt,
  perfectionistNatural,
  eslintPluginUnicorn.configs["flat/recommended"],
  {
    rules: {
      // Perfectionist
      "perfectionist/sort-objects": "off",
      "perfectionist/sort-jsx-props": "off",
      "perfectionist/sort-vue-attributes": "off",
      "perfectionist/sort-svelte-attributes": "off",
      "perfectionist/sort-astro-attributes": "off",

      // Unicorn
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": "off",
    },
  },
  eslintConfigPrettier,
];
