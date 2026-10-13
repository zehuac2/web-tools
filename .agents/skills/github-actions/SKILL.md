---
name: github-actions
description:
  Guidance for authoring and maintaining GitHub Actions workflows. Use whenever
  the user wants a GitHub Actions workflow created or modified. Covers pinning
  actions to their latest version, plus file naming and required triggers for
  GitHub Pages deploy workflows, release-asset upload workflows, and Homebrew
  formula publish workflows.
---

# GitHub Actions

General requirements:

- Always use the latest version of an action. Pin only the major version. Do not
  pin the minor or patch version.
- Set a sensible timeout for each job unless the user explicitly asks otherwise.

Each workflow type has its own requirements. See these pages:

- [Deploy to Github Pages](workflows/deploy-github-pages.md)
- [Create Release Assets](workflows/create-release-assets.md)
- [Publish Brew Release](workflows/publish-brew-release.md)
