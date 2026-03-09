// =============================================================================
// Stylelint Configuration
// =============================================================================
//
// CSS and SCSS linter for consistent stylesheet code quality.
// Documentation: https://stylelint.io/
//
// -----------------------------------------------------------------------------
// Usage
// -----------------------------------------------------------------------------
//
//   Lint all stylesheets:
//     npx stylelint "**/*.{css,scss}"
//
//   Auto-fix issues:
//     npx stylelint "**/*.{css,scss}" --fix
//
//   Lint specific file:
//     npx stylelint src/sturnus/package/styles.scss
//
// -----------------------------------------------------------------------------
// Rule Severity
// -----------------------------------------------------------------------------
//
//   null:   Disable rule
//   true:   Enable with default options
//   [...]:  Enable with custom options
//
// =============================================================================

module.exports = {
    // JSON Schema for IDE support
    $schema: "https://json.schemastore.org/stylelintrc",

    // ===========================================================================
    // Extends
    // ===========================================================================
    //
    // Base configurations to extend:
    //   - stylelint-config-standard: Recommended CSS rules
    //   - stylelint-config-standard-scss: Additional SCSS rules
    //
    // ---------------------------------------------------------------------------

    extends: ["stylelint-config-standard", "stylelint-config-standard-scss"],

    // ===========================================================================
    // Plugins
    // ===========================================================================
    //
    // Additional rule packages:
    //   - stylelint-order: Property ordering rules
    //
    // ---------------------------------------------------------------------------

    plugins: ["stylelint-order"],

    // ===========================================================================
    // Rules
    // ===========================================================================

    rules: {
        // -------------------------------------------------------------------------
        // Disabled Rules
        // -------------------------------------------------------------------------
        // Rules that don't fit this project's needs

        // Allow empty source files (placeholder stylesheets)
        "no-empty-source": null,

        // Specificity warnings are often false positives
        "no-descending-specificity": null,

        // Allow any class naming convention
        "selector-class-pattern": null,
        "selector-id-pattern": null,

        // Allow custom property and keyframe naming
        "custom-property-pattern": null,
        "keyframes-name-pattern": null,

        // Allow duplicate selectors (common in large files)
        "no-duplicate-selectors": null,

        // Allow deprecated properties (legacy support)
        "property-no-deprecated": null,

        // Don't limit number precision
        "number-max-precision": null,

        // Allow longhand properties (explicit is sometimes clearer)
        "declaration-block-no-redundant-longhand-properties": null,

        // -------------------------------------------------------------------------
        // Enabled Rules
        // -------------------------------------------------------------------------

        // Alphabetically order properties for consistency
        "order/properties-alphabetical-order": true,

        // Use legacy color function notation: rgb(255, 0, 0) not rgb(255 0 0)
        "color-function-notation": "legacy",

        // Use number notation for alpha: rgba(0, 0, 0, 0.5) not rgba(0, 0, 0, 50%)
        "alpha-value-notation": "number",

        // -------------------------------------------------------------------------
        // Pseudo-Element/Class Handling
        // -------------------------------------------------------------------------
        // Allow browser-specific and custom pseudo-elements/classes

        "selector-pseudo-element-no-unknown": [
            true,
            {
                ignorePseudoElements: [
                    "input-placeholder", // Older placeholder syntax
                    "controls", // Media controls
                ],
            },
        ],

        "selector-pseudo-class-no-unknown": [
            true,
            {
                ignorePseudoClasses: [
                    "placeholder",
                    "input-placeholder",
                    "pause", // Media pseudo-class
                ],
            },
        ],

        // -------------------------------------------------------------------------
        // Property Handling
        // -------------------------------------------------------------------------

        "property-no-unknown": [
            true,
            {
                ignoreProperties: [
                    "font-smooth", // Non-standard but widely used
                ],
            },
        ],

        // -------------------------------------------------------------------------
        // SCSS-Specific Rules
        // -------------------------------------------------------------------------

        // Allow unspaced operators in SCSS (common in calculations)
        "scss/operator-no-unspaced": null,

        // Allow Tailwind and SCSS at-rules
        "scss/at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: [
                    // Tailwind CSS
                    "tailwind",
                    "apply",
                    "variants",
                    "responsive",
                    "screen",
                    "layer",
                ],
            },
        ],

        // -------------------------------------------------------------------------
        // At-Rule Handling
        // -------------------------------------------------------------------------
        // Allow SCSS and Tailwind at-rules

        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: [
                    // Tailwind CSS
                    "tailwind",
                    "apply",
                    "variants",
                    "responsive",
                    "screen",
                    "layer",

                    // SCSS
                    "use",
                    "forward",
                    "mixin",
                    "include",
                    "function",
                    "return",
                    "if",
                    "else",
                    "each",
                    "for",
                    "while",
                    "extend",
                    "at-root",
                    "debug",
                    "warn",
                    "error",
                ],
            },
        ],
    },

    // ===========================================================================
    // Ignored Files
    // ===========================================================================
    //
    // Files and directories to exclude from linting.
    //
    // ---------------------------------------------------------------------------

    ignoreFiles: [
        // Dependencies
        "node_modules/**",

        // Build outputs
        "dist/**",
        "build/**",
        "public/**",

        // Python environments
        ".venv/**",
        "venv/**",

        // Test & coverage
        "htmlcov/**",
        "tst/**",

        // Generated documentation
        "site/**",

        // Development scratch directories
        "bup/**",
        "wip/**",
        "tmp/**",

        // Django collected static files
        "**/static/**",

        // Minified/vendor files
        "**/*.min.css",
        "**/vendor/**",
    ],
};
