// =============================================================================
// Semantic Release Configuration
// =============================================================================
//
// Automated version management and package publishing.
// Documentation: https://semantic-release.gitbook.io/
//
// -----------------------------------------------------------------------------
// How It Works
// -----------------------------------------------------------------------------
//
// Semantic Release automates the release process:
//
//   1. Analyze commits since last release
//   2. Determine version bump (major/minor/patch)
//   3. Generate changelog
//   4. Update version files
//   5. Create Git tag
//   6. Publish to registries
//   7. Create GitHub release
//
// Version bumps follow Semantic Versioning (semver.org):
//   - BREAKING CHANGE → major (1.0.0 → 2.0.0)
//   - feat: → minor (1.0.0 → 1.1.0)
//   - fix: → patch (1.0.0 → 1.0.1)
//
// -----------------------------------------------------------------------------
// Usage
// -----------------------------------------------------------------------------
//
//   Dry run (preview):
//     npx semantic-release --dry-run
//
//   Actual release (usually CI-only):
//     npx semantic-release
//
// -----------------------------------------------------------------------------
// Required Environment Variables
// -----------------------------------------------------------------------------
//
//   GITHUB_TOKEN: GitHub personal access token
//   NPM_TOKEN:    npm authentication token (if publishing to npm)
//   PYPI_TOKEN:   PyPI token (if publishing to PyPI)
//
// =============================================================================

module.exports = {
    // JSON Schema for IDE support
    $schema: "https://json.schemastore.org/semantic-release",

    // ===========================================================================
    // Release Branches
    // ===========================================================================
    //
    // Branches that trigger releases:
    //   - main: Production releases (1.0.0, 1.1.0, etc.)
    //   - dev: Beta prereleases (1.1.0-beta.1)
    //   - next: Next prereleases (1.1.0-next.1)
    //
    // ---------------------------------------------------------------------------

    branches: [
        "main",
        {
            name: "dev",
            prerelease: "beta", // 1.0.0-beta.1
        },
        {
            name: "next",
            prerelease: true, // 1.0.0-next.1
        },
    ],

    // ===========================================================================
    // Tag Format
    // ===========================================================================
    //
    // Git tag naming convention.
    // v${version} creates tags like v1.0.0, v1.1.0-beta.1
    //
    // ---------------------------------------------------------------------------

    tagFormat: "v${version}",

    // ===========================================================================
    // Plugins
    // ===========================================================================
    //
    // Plugins run in order. Each plugin handles part of the release process.
    //
    // ---------------------------------------------------------------------------

    plugins: [
        // -------------------------------------------------------------------------
        // Commit Analyzer
        // -------------------------------------------------------------------------
        // Analyzes commits to determine version bump type.

        [
            "@semantic-release/commit-analyzer",
            {
                // Use Conventional Commits format
                preset: "conventionalcommits",

                // Custom release rules
                releaseRules: [
                    { type: "feat", release: "minor" }, // Features → minor
                    { type: "fix", release: "patch" }, // Fixes → patch
                    { type: "perf", release: "patch" }, // Performance → patch
                    { type: "revert", release: "patch" }, // Reverts → patch
                    { type: "refactor", release: "patch" }, // Refactors → patch

                    // No release for these types
                    { type: "docs", release: false },
                    { type: "style", release: false },
                    { type: "test", release: false },
                    { type: "build", release: false },
                    { type: "ci", release: false },
                    { type: "chore", release: false },

                    // Breaking changes always trigger major
                    { breaking: true, release: "major" },
                ],
            },
        ],

        // -------------------------------------------------------------------------
        // Release Notes Generator
        // -------------------------------------------------------------------------
        // Generates changelog content from commits.

        [
            "@semantic-release/release-notes-generator",
            {
                preset: "conventionalcommits",

                // Organize changelog by commit type
                presetConfig: {
                    types: [
                        { type: "feat", section: "✨ Features" },
                        { type: "fix", section: "🐛 Bug Fixes" },
                        { type: "perf", section: "⚡ Performance" },
                        { type: "revert", section: "⏪ Reverts" },
                        { type: "docs", section: "📚 Documentation" },
                        { type: "refactor", section: "♻️ Refactoring" },

                        // Hidden sections (not in changelog)
                        {
                            type: "style",
                            section: "💎 Code Style",
                            hidden: true,
                        },
                        { type: "test", section: "✅ Tests", hidden: true },
                        { type: "build", section: "📦 Build", hidden: true },
                        { type: "ci", section: "👷 CI/CD", hidden: true },
                        { type: "chore", section: "🔧 Chores", hidden: true },
                    ],
                },
            },
        ],

        // -------------------------------------------------------------------------
        // Changelog
        // -------------------------------------------------------------------------
        // Updates CHANGELOG.md file.

        [
            "@semantic-release/changelog",
            {
                changelogFile: "CHANGELOG.md",
                changelogTitle: `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).`,
            },
        ],

        // -------------------------------------------------------------------------
        // Exec
        // -------------------------------------------------------------------------
        // Run custom commands during release.
        // Updates VERSION file and syncs metadata across files.

        [
            "@semantic-release/exec",
            {
                prepareCmd:
                    "echo ${nextRelease.version} > VERSION && python bin/sync_metadata.py",
            },
        ],

        // -------------------------------------------------------------------------
        // Git
        // -------------------------------------------------------------------------
        // Commits release changes and creates tag.

        [
            "@semantic-release/git",
            {
                // Files to commit
                assets: [
                    "CHANGELOG.md",
                    "VERSION",
                    "pyproject.toml",
                    "package.json",
                    "codemeta.json",
                    "CITATION.cff",
                ],

                // Commit message template
                message:
                    "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
            },
        ],

        // -------------------------------------------------------------------------
        // GitHub
        // -------------------------------------------------------------------------
        // Creates GitHub release.

        [
            "@semantic-release/github",
            {
                // Don't comment on issues/PRs
                successComment: false,
                failComment: false,
            },
        ],
    ],
};
