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
    ignores: [
      "**/node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "src/generated/**",
      "prisma/client/**",
      "**/*.generated.*",
      ".env",
      ".env.*",
      ".git/**"
    ]
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module"
    },
    rules: {
      // Common rules to fix issues
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_", 
        "varsIgnorePattern": "^_" 
      }],
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },
  {
    files: ["src/lib/prisma.ts"],
    rules: {
      "no-var": "off" // Allow var in the prisma file for global declarations
    }
  }
];

export default eslintConfig;
