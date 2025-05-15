import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import eslintPluginTypeScript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import globals from "globals";

const compat = new FlatCompat();

export default [
    js.configs.recommended,
    ...compat.extends("plugin:@typescript-eslint/recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"),

    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021
            }
        }
    },

    // TypeScript files configuration
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.eslint.json",
                tsconfigRootDir: import.meta.dirname
            }
        },
        settings: {
            react: {
                version: "detect"
            },
            "import/resolver": {
                typescript: {}
            }
        },
        plugins: {
            "@typescript-eslint": eslintPluginTypeScript
        }
    },

    // JavaScript files configuration (without TypeScript parser)
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
                ecmaVersion: "latest",
                sourceType: "module"
            }
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    },

    // React specific rules
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "jsx-a11y": jsxA11yPlugin,
            "react-refresh": reactRefreshPlugin,
            import: importPlugin
        },
        rules: {
            // React rules
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/jsx-uses-react": "off",
            "react/jsx-props-no-spreading": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

            // Import rules
            "import/order": [
                "error",
                {
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                    "newlines-between": "always",
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true
                    }
                }
            ],
            "import/no-unresolved": "error",

            // General rules
            "no-unused-vars": "off", // TypeScript handles this
            "no-console": ["warn", { allow: ["warn", "error"] }]
        }
    },

    // TypeScript-specific rules
    {
        files: ["**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "off"
        }
    },

    // Prettier integration
    {
        plugins: {
            prettier
        },
        rules: {
            "prettier/prettier": [
                "error",
                {
                    trailingComma: "none",
                    tabWidth: 4,
                    semi: true,
                    singleQuote: false,
                    bracketSameLine: true,
                    printWidth: 150,
                    singleAttributePerLine: true,
                    endOfLine: "crlf"
                }
            ]
        }
    },

    // Override rules for specific file patterns
    {
        files: ["vite.config.ts"],
        rules: {
            "import/no-default-export": "off"
        }
    },

    // Configuration for the ESLint config file itself
    {
        files: ["eslint.config.js"],
        rules: {
            "@typescript-eslint/no-unused-vars": "off",
            "import/no-unresolved": "off" // In case of any import resolution issues in the config file
        }
    }
];
