---
name: package-management
description:
  Use when managing project packages, dependencies, runtimes, lockfiles, or
  package manager commands. For JavaScript and TypeScript, prefer bun and use
  caret version ranges for dependencies.
---

# Package Management

Use a caret version range when you install a package or edit a manifest. If you
do not know the package version from project files, registry metadata, or user
instructions, look up the version before you install the package.

## JavaScript and TypeScript

Use `bun` for package management, script execution, and runtime commands. Use a
different tool only when the repository clearly requires it, through a lockfile,
workspace config, CI command, or maintainer instruction.

## PII

- Do not list author emails in package metadata unless the user asks you to.
