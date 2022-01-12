# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Changed map storage for tracking time a tab was last interacted with. Map key was altered from `tab id` (which is guaranteed to be unique, but can change on Chrome reloading), to `tab url` (which is static and will remain the same on session reloads, but is not gauranteed to be unique). Value was altered from Date object to Unix timestamp.

## [3.0.0] - 2021-12-05


## [2.0.5] - 2021-09-02

### Fixed
- Fixed regression in auto-grouping functionality

## [2.0.4] - 2021-08-19

### Changed
- Changed visible tab limiting feature to disabled by default

## [2.0.3] - 2021-08-17

### Added

- Adds tab LRU to automatically limit the number of tabs you have opened
- Adds PR test workflow action

### Changed

- Re-designed options tooltip
- Ported service worker files to Typescript

## [2.0.2] - 2021-08-17

## [2.0.1] - 2021-03-04

### Added

- Added option to disable auto-deduplication.

### Changed

- Re-organized options page, changed wording for clarity and brevity.

## [2.0.0] - 2021-03-03

### Added

- Added "old tab" grouping functionality.
- Added unit tests.

### Changed

- Migrated project to manifest v3 to take advantage of new tab grouping API.

### Fixed

- Fixed issue with removing old tab.

## [1.0.0] - N/A

### Added

- Initial release.