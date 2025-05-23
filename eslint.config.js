import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pkg from "eslint-plugin-react";

/** @type {import("eslint").Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pkg.configs.flat.recommended,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off", // Allow the use of 'any' everywhere
            "react/react-in-jsx-scope": "off", // Disable this rule for React 17+
        },
    },
];
