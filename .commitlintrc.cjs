// =============================================================================
// Commitlint Configuration
// =============================================================================
//
// Lint commit messages against Conventional Commits format.
// Documentation: https://commitlint.js.org/
//
// -----------------------------------------------------------------------------
// Usage
// -----------------------------------------------------------------------------
//
//   Lint last commit:
//     npx commitlint --from HEAD~1 --to HEAD
//
//   Lint specific message:
//     echo "feat: add feature" | npx commitlint
//
//   With pre-commit hook (automatic):
//     pre-commit install --hook-type commit-msg
//
// -----------------------------------------------------------------------------
// Conventional Commits Format
// -----------------------------------------------------------------------------
//
//   <type>(<scope>): <subject>
//
//   [optional body]
//
//   [optional footer(s)]
//
// Examples:
//   feat(translate): add batch translation support
//   fix(middleware): resolve language detection bug
//   docs: update installation guide
//   chore(deps): bump django from 5.0 to 5.1
//
// -----------------------------------------------------------------------------
// Commit Types
// -----------------------------------------------------------------------------
//
//   feat:      New feature (triggers MINOR version bump)
//   fix:       Bug fix (triggers PATCH version bump)
//   docs:      Documentation only
//   style:     Code style (formatting, no logic change)
//   refactor:  Code change that neither fixes bug nor adds feature
//   perf:      Performance improvement
//   test:      Adding/updating tests
//   build:     Build system or dependencies
//   ci:        CI configuration
//   chore:     Other changes (no production code)
//   revert:    Revert previous commit
//
// =============================================================================

module.exports = {
    // Extend the conventional commits preset
    extends: ["@commitlint/config-conventional"],

    rules: {
        // =========================================================================
        // Type Rules
        // =========================================================================

        // Allowed commit types
        // 2 = error, "always" = always enforce, [...] = allowed values
        "type-enum": [
            2,
            "always",
            [
                "feat", // New feature
                "fix", // Bug fix
                "docs", // Documentation
                "style", // Code style (formatting)
                "refactor", // Code refactoring
                "perf", // Performance improvement
                "test", // Tests
                "build", // Build system
                "ci", // CI configuration
                "chore", // Chores
                "revert", // Reverts
            ],
        ],

        // Type cannot be empty
        "type-empty": [2, "never"],

        // =========================================================================
        // Scope Rules
        // =========================================================================

        // Suggested scopes (warning only - allows unlisted scopes)
        // 1 = warning, "always" = always check
        "scope-enum": [
            1,
            "always",
            [
                // Feature areas
                "translate",
                "admin",
                "middleware",
                "models",
                "services",
                "templates",

                // Infrastructure
                "config",
                "tests",
                "docs",
                "ci",
                "deps",
            ],
        ],

        // =========================================================================
        // Subject Rules
        // =========================================================================

        // Subject cannot be empty
        "subject-empty": [2, "never"],

        // Subject should be lowercase (warning)
        "subject-case": [1, "always", "lower-case"],

        // No period at end of subject
        "subject-full-stop": [2, "never", "."],

        // =========================================================================
        // Header Rules
        // =========================================================================

        // Maximum header length (type + scope + subject)
        // Aligned with PEP 8 line length (79 chars)
        "header-max-length": [2, "always", 79],

        // =========================================================================
        // Body Rules
        // =========================================================================

        // Blank line required before body
        "body-leading-blank": [2, "always"],

        // Maximum body line length (warning)
        // Aligned with PEP 8 line length (79 chars)
        "body-max-line-length": [1, "always", 79],

        // =========================================================================
        // Footer Rules
        // =========================================================================

        // Blank line required before footer
        "footer-leading-blank": [2, "always"],
    },
};
