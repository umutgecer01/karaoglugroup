# Release branch notes

This checkout preserves the latest 8 November 2026 source, including the automatic, button-free activity photo strip. The original flat files from main are retained for history; the active build uses src/, public/ and scripts/.

- Node 22, npm ci, static multilingual HTML and disabled Netlify Forms.
- Production promotion remains restricted to main; the production workflow also has an explicit main-ref guard.
- Deploy Preview/branch builds emit noindex metadata and an X-Robots-Tag header file, while canonical/hreflang remain on the production domain.
- ESLint stays on version 10; scoped minimatch 11.0.1 overrides address GHSA-g3hv-75wg-m249. The removed matcher APIs are not used by the inspected consumers; lint/build tests verify the project patterns. Review this override when ESLint adopts the patched major natively.
- Raw local QA output, dependency directories, dist, .env and temporary snapshots are excluded from Git. Existing historical report links to these local artifacts are for the original workspace; current test results are summarized in the PR and final sync report.
- Forms require recipient/delivery and corporate/legal approval before activation. No actual form messages were sent.

## Local validation on Node 22.23.4

- Clean npm ci, live npm audit (0 vulnerabilities), security lint.
- 7 core regressions; 4 production and 4 preview static-output checks.
- 594 responsive checks and 101 local URL/media resources.
- 110 interaction checks and 51 same-page language switches, plus native video playback.
- Local preview-mode robots stays noindex after hydration; canonical URLs remain production URLs.
- Latest three-run lab LCP medians: mobile 1.980 s, desktop 2.140 s; field/Lighthouse results are not available.
- Contact and career forms remain disabled. Actual delivery and corporate/legal approval remain external requirements.

GitHub upload/PR/Netlify preview were not performed in this session: the integration rejected content writes with HTTP 403, native Git had no credentials, and the user then requested local-only commit preparation.
