// =============================================================================
// ESLint Configuration (Flat Config - ESLint 9.x)
// =============================================================================
//
// Modern "flat config" format for ESLint 9.x and later.
// Documentation: https://eslint.org/docs/latest/use/configure/configuration-files
//
// This file is portable - copy to other repos without modification.
//
// -----------------------------------------------------------------------------
// Usage
// -----------------------------------------------------------------------------
//
//   Lint all files:
//     npx eslint .
//
//   Lint specific directory:
//     npx eslint src/
//
//   Auto-fix issues:
//     npx eslint --fix .
//
//   Check specific file:
//     npx eslint src/sturnus/package/file.ts
//
//   Show config for a file:
//     npx eslint --print-config src/file.ts
//
// -----------------------------------------------------------------------------
// Flat Config vs Legacy (.eslintrc)
// -----------------------------------------------------------------------------
//
// ESLint 9.x uses "flat config" (eslint.config.js) by default:
//   - Native ES modules (import/export)
//   - Explicit plugin imports (no magic resolution)
//   - Configuration objects in an array
//   - `files` and `ignores` patterns per config block
//
// Legacy .eslintrc.* files are deprecated but still supported.
//
// =============================================================================

// =============================================================================
// Imports
// =============================================================================

// Core ESLint recommended rules
import js from "@eslint/js";

// TypeScript support via typescript-eslint

// Prettier integration - disables rules that conflict with Prettier
import prettier from "eslint-config-prettier";

// Global variable definitions (browser, node, etc.)
import importPlugin from "eslint-plugin-import-x";
import globals from "globals";

// Import/export linting (order, duplicates, etc.)
import tseslint from "typescript-eslint";

// Security vulnerability detection

// =============================================================================
// Configuration Export
// =============================================================================
//
// Using tseslint.config() helper for better TypeScript integration.
// Returns an array of configuration objects processed in order.
//
// -----------------------------------------------------------------------------

export default tseslint.config(
    // =========================================================================
    // Global Ignores
    // =========================================================================
    //
    // Patterns to ignore across all configurations.
    // These files/directories are never linted.
    //
    // -------------------------------------------------------------------------
    {
        ignores: [
            // Build outputs
            "dist/**",
            "build/**",
            "public/**",

            // Dependencies
            "node_modules/**",

            // Python environments
            ".venv/**",
            "venv/**",

            // Django static files (collected assets)
            "**/static/**",

            // Minified files (already processed)
            "**/*.min.js",

            // Test & coverage
            "htmlcov/**",
            "tst/**",

            // Generated documentation
            "site/**",

            // Development scratch directories
            "bup/**",
            "wip/**",
            "tmp/**",

            // Vendor/third-party code
            "**/vendor/**",
        ],
    },

    // =========================================================================
    // JavaScript Files
    // =========================================================================
    //
    // Configuration for .js, .mjs, .cjs files.
    // Extends ESLint's recommended ruleset.
    //
    // -------------------------------------------------------------------------
    {
        files: ["**/*.{js,mjs,cjs}"],

        extends: [js.configs.recommended],

        languageOptions: {
            // ECMAScript version - "latest" uses newest available
            ecmaVersion: "latest",

            // Module type - "module" for ES modules, "script" for CommonJS
            sourceType: "module",

            // Global variables available without declaring
            globals: {
                // Browser APIs
                ...globals.browser,

                // Node.js APIs
                ...globals.node,

                // Commonly used globals (explicit for clarity)
                window: "readonly",
                document: "readonly",
                console: "readonly",
                process: "readonly",
                __dirname: "readonly",
                module: "readonly",
                require: "readonly",
            },
        },

        rules: {
            // -----------------------------------------------------------------
            // Possible Errors
            // -----------------------------------------------------------------

            // Warn on unused variables (error is too strict for development)
            "no-unused-vars": "warn",

            // Warn on console.log (use proper logging in production)
            "no-console": "warn",

            // Catch template literal syntax in regular strings
            // e.g., "Hello ${name}" instead of `Hello ${name}`
            "no-template-curly-in-string": "warn",

            // Prevent x === x comparisons (usually a mistake)
            "no-self-compare": "error",

            // -----------------------------------------------------------------
            // Best Practices
            // -----------------------------------------------------------------

            // Disallow var - use const/let instead
            "no-var": "error",

            // Prefer const for variables that aren't reassigned
            "prefer-const": "error",

            // Allow string concatenation (template literals aren't always clearer)
            "prefer-template": "off",

            // Require === and !== (no type coercion surprises)
            eqeqeq: ["error", "always"],

            // Always use curly braces for control statements
            curly: ["error", "all"],

            // -----------------------------------------------------------------
            // Stylistic
            // -----------------------------------------------------------------

            // Warn on non-camelCase variable names
            camelcase: "warn",

            // Warn on nested ternaries (hard to read)
            "no-nested-ternary": "warn",

            // Prefer concise arrow functions when possible
            // () => expression instead of () => { return expression; }
            "arrow-body-style": ["warn", "as-needed"],
        },
    },

    // =========================================================================
    // TypeScript Files
    // =========================================================================
    //
    // Configuration for .ts, .tsx files.
    // Extends both ESLint recommended and typescript-eslint recommended.
    //
    // -------------------------------------------------------------------------
    {
        files: ["**/*.{ts,tsx}"],

        extends: [js.configs.recommended, ...tseslint.configs.recommended],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",

            globals: {
                window: "readonly",
                document: "readonly",
                console: "readonly",
                process: "readonly",
            },

            // TypeScript parser options
            parserOptions: {
                // Enable type-aware linting (requires tsconfig.json)
                project: true,

                // Root directory for finding tsconfig.json
                tsconfigRootDir: import.meta.dirname,
            },
        },

        rules: {
            // -----------------------------------------------------------------
            // TypeScript-Specific Rules
            // -----------------------------------------------------------------

            // Warn on unused variables (TypeScript version)
            "@typescript-eslint/no-unused-vars": "warn",

            // Warn on `any` type (explicit any defeats type safety)
            "@typescript-eslint/no-explicit-any": "warn",

            // Don't require explicit return types (inference is usually fine)
            "@typescript-eslint/explicit-function-return-type": "off",

            // Warn on non-null assertions (x!) - prefer proper null handling
            "@typescript-eslint/no-non-null-assertion": "warn",

            // Enforce `import type` for type-only imports
            // Helps bundlers tree-shake and clarifies intent
            "@typescript-eslint/consistent-type-imports": "warn",

            // -----------------------------------------------------------------
            // General Rules (also apply to TypeScript)
            // -----------------------------------------------------------------

            "no-console": "warn",
            "no-var": "error",
            "prefer-const": "error",
            eqeqeq: ["error", "always"],
            curly: ["error", "all"],
        },
    },

    // =========================================================================
    // Import Plugin Configuration
    // =========================================================================
    //
    // Enforce consistent import ordering and catch import errors.
    //
    // -------------------------------------------------------------------------
    {
        files: ["**/*.{js,mjs,ts,tsx}"],

        plugins: {
            "import-x": importPlugin,
        },

        rules: {
            // Enforce import grouping and ordering
            "import/order": [
                "warn",
                {
                    // Group order: builtin → external → internal → relative
                    groups: [
                        "builtin", // Node.js built-ins (fs, path)
                        "external", // npm packages
                        "internal", // Aliased imports (@/...)
                        "parent", // Parent directory (..)
                        "sibling", // Same directory (./)
                        "index", // Index file (.)
                    ],

                    // Blank line between groups
                    "newlines-between": "always",

                    // Sort alphabetically within groups
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],
        },
    },

    // =========================================================================
    // Demo App Overrides
    // =========================================================================
    //
    // The demo app (exe/) is for development/testing - allow console usage.
    //
    // -------------------------------------------------------------------------
    {
        files: ["exe/**/*.{js,ts,tsx}"],

        rules: {
            "no-console": "off",
        },
    },

    // =========================================================================
    // Test File Overrides
    // =========================================================================
    //
    // Tests often need relaxed rules for mocking and assertions.
    //
    // -------------------------------------------------------------------------
    {
        files: [
            "**/*.spec.{js,ts}",
            "**/*.test.{js,ts}",
            "**/tst/**/*.{js,ts}",
        ],

        rules: {
            // Console is useful for test debugging
            "no-console": "off",

            // Tests may need `any` for mocking
            "@typescript-eslint/no-explicit-any": "off",
        },
    },

    // =========================================================================
    // Configuration File Overrides
    // =========================================================================
    //
    // Config files (vite.config.ts, webpack.config.cjs) have different needs.
    //
    // -------------------------------------------------------------------------
    {
        files: ["*.config.{js,ts,mjs,cjs}", "webpack*.cjs"],

        rules: {
            // Config files often log for debugging
            "no-console": "off",

            // CommonJS configs may use require()
            "@typescript-eslint/no-require-imports": "off",
        },
    },

    // =========================================================================
    // Prettier Compatibility (MUST BE LAST)
    // =========================================================================
    //
    // eslint-config-prettier disables all ESLint rules that conflict with
    // Prettier formatting. This should always be the last config in the array.
    //
    // -------------------------------------------------------------------------
    prettier,
);
