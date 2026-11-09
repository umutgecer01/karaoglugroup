# Project workflow

- The primary working copy is this directory. The sibling `release/` checkout is historical; do not implement new changes there.
- Repository: `https://github.com/umutgecer01/karaoglugroup`. Work on `release/karaoglu-final-2026-11-08`; never push directly to main or force-push.
- The user authorized completed changes to be committed and pushed to this release branch, followed by Netlify preview verification. Use `npm run sync:preview -- "Describe the completed change"` after source changes, or equivalent checked Git commands. Do not ask for release push permission again unless the user changes this authorization.
- Keep meaningful changes and Markdown release reports in Git. Exclude `.audit/`, dependencies, build output, local Netlify state, raw QA output and credentials. Never commit tokens or private keys.
- Use Node 22. Preserve the CodeQL fixes, three existing languages, responsive images and automatic activity gallery.
- Keep `VITE_NETLIFY_FORMS_ENABLED=false`. Do not submit real messages or CVs.
- Preview project: `80b58d06-0cbb-432c-8193-17d34ba776df`, connected to this repository and PR #1. Confirm the latest preview corresponds to the pushed commit; do not treat an older successful deploy as current.
- Production: `https://karaoglugroupnet.netlify.app/`, site ID `b4753086-eb94-4a7e-b5f5-7270835fab3a`. Its old Git integration remains paused. Production publishing always requires new explicit user approval for that release. Do not re-enable automatic production builds, change site connections/secrets/DNS or merge to main without specific authorization.
- The production GitHub workflow is manual-only. Production credentials are not provisioned; do not claim the Actions production path is configured. Approved releases can use the official authenticated CLI with the explicit old site ID, after a separate production-context build and hash verification.
- Test changes appropriately. Do not repeat full expensive browser suites for documentation-only updates, or claim physical-device/field-performance/form-delivery tests that were not performed.
