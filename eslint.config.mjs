import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // React rules
      "react/no-unescaped-entities": "off",

      // TypeScript rules - Re-enabled as warnings for gradual adoption
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn", // ✅ Re-enabled as warning
      "@typescript-eslint/ban-ts-comment": "warn",  // ✅ Re-enabled as warning

      // Test rules
      "jest/no-disabled-tests": "off",

      // Security-focused rules
      "no-eval": "error",                    // ✅ Prevent eval() usage
      "no-implied-eval": "error",            // ✅ Prevent setTimeout(string)
      "no-new-func": "error",                // ✅ Prevent new Function()
      "no-script-url": "error",              // ✅ Prevent javascript: URLs
      "no-console": ["warn", {               // ✅ Warn on console usage
        allow: ["warn", "error"]
      }],
    }
  }
];

export default eslintConfig;
