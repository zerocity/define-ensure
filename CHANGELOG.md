# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.2.0](https://github.com/zerocity/define-ensure/compare/v0.1.10...v0.2.0) (2026-01-12)


### ⚠ BREAKING CHANGES

* Removed invariant, InvariantError, and isInvariantError

The invariant function was not a drop-in replacement for tiny-invariant
as it did not use asserts signature and returned a value instead of void

Migration: Use ensure() instead and capture the returned narrowed value
See BREAKING_CHANGES.md for details

### Features

* add assert function with inline configuration ([9e715bb](https://github.com/zerocity/define-ensure/commit/9e715bba14ceb3b7d521e238cfd26e3cfaf6736e))
* add cleanStack support with browser detection ([a7124b4](https://github.com/zerocity/define-ensure/commit/a7124b4e622c76af91ac1eba5aecd36d217c09ab))
* remove invariant exports ([f9a23cf](https://github.com/zerocity/define-ensure/commit/f9a23cfbca9fe94fb5cccb1c039f16ee81829c4d))

## [0.1.10](https://github.com/zerocity/define-ensure/compare/v0.1.9...v0.1.10) (2026-01-11)

## [0.1.9](https://github.com/zerocity/define-ensure/compare/v0.1.8...v0.1.9) (2026-01-11)


### Bug Fixes

* add missing release:patch task ([1342830](https://github.com/zerocity/define-ensure/commit/1342830cd920c5a95a9093eb9d74cc403b3290cb))

## [0.1.8](https://github.com/zerocity/define-ensure/compare/v0.1.7...v0.1.8) (2026-01-11)


### Bug Fixes

* fix npm publish auth and remove duplicate build check ([e84eb62](https://github.com/zerocity/define-ensure/commit/e84eb622e620e82a55375ba28462f36d404de429))

## [0.1.7](https://github.com/zerocity/define-ensure/compare/v0.1.6...v0.1.7) (2026-01-11)


### Features

* add mise tasks for release and publish ([862c68f](https://github.com/zerocity/define-ensure/commit/862c68f3279d7d2cff6bc60229bf8b778e1ccbfc))

## [0.1.6](https://github.com/zerocity/define-ensure/compare/v0.1.5...v0.1.6) (2026-01-10)


### Features

* add npm publishing support ([3e06d6c](https://github.com/zerocity/define-ensure/commit/3e06d6c1662efbb640816a195f312b7baa721c95))


### Bug Fixes

* disable lint rule for jsr import ([8e5e082](https://github.com/zerocity/define-ensure/commit/8e5e082537e4118039f693729d71b315c3eed708))

## [0.1.5](https://github.com/zerocity/define-ensure/compare/v0.1.4...v0.1.5) (2026-01-10)


### Bug Fixes

* cleanup repo ([80a31bc](https://github.com/zerocity/define-ensure/commit/80a31bc3955567008e28e1c822b34a24aa79818c))

## [0.1.4](https://github.com/zerocity/define-ensure/compare/v0.1.3...v0.1.4) (2026-01-10)


### Bug Fixes

* cleanup repo ([2b619c6](https://github.com/zerocity/define-ensure/commit/2b619c60fb1d1f01f6046d4429c58559c34a7b82))

## [0.1.3](https://github.com/zerocity/define-ensure/compare/v0.1.2...v0.1.3) (2026-01-10)


### Bug Fixes

* cleanup repo ([d18fa36](https://github.com/zerocity/define-ensure/commit/d18fa366193eb8ecc5c4af0bd270cd383d34df8b))

## [0.1.2](https://github.com/zerocity/define-ensure/compare/v0.1.1...v0.1.2) (2026-01-10)

## [0.1.1](https://github.com/zerocity/define-ensure/compare/v0.1.0...v0.1.1) (2026-01-10)


### Bug Fixes

* test ci workflow ([b8947da](https://github.com/zerocity/define-ensure/commit/b8947da6471d27a1acaa05a8929aa16ffbceed87))

## 0.1.0 (2026-01-10)


### Features

* add JSR package config, invariant export, and docs ([9398861](https://github.com/zerocity/define-ensure/commit/9398861697a9c7e3e4abc6b9913deced4eb98696))
* initial release - type-safe runtime assertions for Deno ([70a3f1c](https://github.com/zerocity/define-ensure/commit/70a3f1cbc4aa3c8e4bbd78fb3d23cc7f115feb2f))
