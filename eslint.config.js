import eslintConfigPrettier from "eslint-config-prettier";
import perfectionistNatural from "eslint-plugin-perfectionist/configs/recommended-natural";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

import { withNuxt } from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  perfectionistNatural,
  eslintPluginUnicorn.configs["flat/recommended"],
  {
    rules: {
      "perfectionist/sort-astro-attributes": "off",
      "perfectionist/sort-jsx-props": "off",
      "perfectionist/sort-svelte-attributes": "off",
      "perfectionist/sort-vue-attributes": "off",
      "unicorn/filename-case": "off",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },
  eslintConfigPrettier,
);
