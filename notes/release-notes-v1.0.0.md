# @jonloucks/variants-ts v1.0.0
```bash
npm install @jonloucks/variants-ts@1.0.0
```

## Customer impact
*  Safer releases and clearer docs for consumers and maintainers.

## Forked Repositories Impact
*  None

## 🚀 New Features

*  None

## ✨ Improvements

*   Performance: None
*   Compatibility: Verified and documented support for Node.js 16.x, 18.x, 20.x, 22.x, and 24.x.
*   Documentation:
	* Updated README workflow/docs content to match current CI and release behavior.
	* Updated project structure documentation to reflect current repository layout.
	* Improved entrypoint API documentation in `src/index.ts` and expanded API comments across core interfaces.

## 🐛 Bug Fixes
*  Fixed release pipeline gap by requiring smoke test matrix success before publish can run.
*  Fixed inconsistent workflow naming by standardizing smoke job IDs (`build-package`, `smoke_matrix`, `smoke_summary`) across PR/push/release smoke workflows.
*  Fixed stale README instructions (`npm run variants`) and outdated publish workflow description.

## ⚠️ Important Changes

*  Release publishing is now gated by `main-release-smoke` completion status (`success`) before `main-release.yml` can publish.
*  Trusted publishing with npm remains enabled via OIDC provenance (`--provenance`).
*  Package version advanced to `1.0.0` in `package.json`, `package-lock.json`, and `src/version.ts`.

## 🧭 Upgrade Notes

*  Consumer projects should run on a supported Node.js version: 16.x, 18.x, 20.x, 22.x, or 24.x.
*  Fork maintainers should ensure their release workflow keeps smoke-matrix gating before publish.
*  Fork maintainers publishing under a new package name should verify `name`, `private`, and npm trusted publisher settings.

## ⬇️ Download

*   [NPM](https://www.npmjs.com/package/@jonloucks/variants-ts/v/1.0.0)
*   [Source code (zip)](https://github.com/jonloucks/variants-ts/archive/refs/tags/v1.0.0.zip)
*   [Source code (tar.gz)](https://github.com/jonloucks/variants-ts/archive/refs/tags/v1.0.0.tar.gz)
