// =============================================================================
// Prettier Configuration
// https://prettier.io/docs/en/options.html
// =============================================================================
//
// This file is portable - copy to other repos without modification.
//
// Prettier is an opinionated code formatter that enforces a consistent style.
// It supports JavaScript, TypeScript, CSS, SCSS, JSON, YAML, Markdown, and more.
//
// Usage:
//   npx prettier --write "src/**/*.{js,ts,css,scss,json}"  # Format files
//   npx prettier --check "src/**/*.{js,ts,css,scss,json}"  # Check formatting
//   npx prettier --write . --ignore-unknown                # Format all files
//
// Editor integration:
//   VS Code: Install "Prettier - Code formatter" extension
//   Settings: "editor.defaultFormatter": "esbenp.prettier-vscode"
//   Settings: "editor.formatOnSave": true
//
// =============================================================================

module.exports = {
    // =========================================================================
    // General Options
    // =========================================================================

    // Line width before wrapping (matches PEP 8 / flake8)
    printWidth: 79,

    // Spaces per indentation level
    tabWidth: 4,

    // Use spaces instead of tabs
    useTabs: false,

    // Add semicolons at end of statements
    semi: true,

    // Use double quotes (matches Python style)
    singleQuote: false,

    // Only quote object keys when required
    quoteProps: "as-needed",

    // Use double quotes in JSX
    jsxSingleQuote: false,

    // Add trailing commas everywhere (ES5+)
    // Reduces git diff noise when adding items
    trailingComma: "all",

    // Spaces inside object braces: { foo: bar }
    bracketSpacing: true,

    // Put > of multi-line elements on new line
    bracketSameLine: false,

    // Always include parens around arrow function args: (x) => x
    arrowParens: "always",

    // How to wrap prose in markdown
    // "preserve": keep as-is, "always": wrap at printWidth
    proseWrap: "preserve",

    // How HTML whitespace is handled
    // "css": respect display property, "strict": all whitespace sensitive
    htmlWhitespaceSensitivity: "css",

    // Line ending style (LF for cross-platform consistency)
    endOfLine: "lf",

    // Format code in embedded languages (e.g., CSS in JS)
    embeddedLanguageFormatting: "auto",

    // Put each HTML attribute on its own line
    singleAttributePerLine: false,

    // Experimental: improved ternary formatting
    experimentalTernaries: true,

    // =========================================================================
    // File-Specific Overrides
    // =========================================================================
    //
    // Different file types may need different settings.
    // Overrides are applied in order, later ones win.
    //
    // =========================================================================

    overrides: [
        // ---------------------------------------------------------------------
        // JSON/JSONC: 2-space indent (standard convention)
        // ---------------------------------------------------------------------
        {
            files: ["*.json", "*.jsonc"],
            options: {
                // tabWidth: 2,
                tabWidth: 4,
            },
        },

        // ---------------------------------------------------------------------
        // YAML: 2-space indent (standard convention)
        // ---------------------------------------------------------------------
        {
            files: ["*.yml", "*.yaml"],
            options: {
                tabWidth: 2,
            },
        },

        // ---------------------------------------------------------------------
        // Markdown: Wrap prose at line width
        // ---------------------------------------------------------------------
        {
            files: ["*.md"],
            options: {
                proseWrap: "always",
            },
        },

        // ---------------------------------------------------------------------
        // HTML: Wider lines, ignore whitespace
        // ---------------------------------------------------------------------
        {
            files: ["*.html"],
            options: {
                printWidth: 79,
                htmlWhitespaceSensitivity: "ignore",
            },
        },

        // ---------------------------------------------------------------------
        // CSS/SCSS: Single quotes for URLs and font names
        // ---------------------------------------------------------------------
        {
            files: ["*.css", "*.scss"],
            options: {
                singleQuote: true,
            },
        },

        // ---------------------------------------------------------------------
        // TypeScript/JavaScript: Wider lines, stable ternaries
        // ---------------------------------------------------------------------
        {
            files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
            options: {
                printWidth: 79,
                experimentalTernaries: false,
            },
        },
    ],
};
