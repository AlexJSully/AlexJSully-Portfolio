# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

To see tags and releases, please go to [Releases](https://github.com/AlexJSully/AlexJSully-Portfolio/releases) on [GitHub](https://github.com/AlexJSully/AlexJSully-Portfolio).

## [2.0.9] - 2024-01-25

UI/UX:

-   Added position title to projects

Data:

-   Updated resume

Update:

-   Updated packages

## [2.0.8] - 2024-01-14

Added a new easter egg! (Hint: aaaaahhhh!)

Optimizations:

-   Optimized images

Bug fix:

-   Fixed typo

## [2.0.7] - 2024-01-13

UI/UX:

-   Added cookie banner
-   When viewing more (or less) projects, scroll to top of projects grid

Optimizations:

-   Added Cypress e2e testing
-   Added new GitHub Actions CI/CD workflow for code quality check
-   Lazy load images
-   Optimized images for file sizes
-   Removed unused DeepSource config
-   Removed used files (3D fox model)
-   Updated CodeQL workflow
-   Updated SEO meta data description
-   Wrapped errors in React memo

Analytics:

-   Added Vercel observability tools to monitor performance

Update:

-   Update packages
-   Update to Node 20

Documentation:

-   Update public facing email
-   Update wording on issue templates

Bug fix:

-   Fixed projects grid not being centered on mobile
-   Fixed resoc Open Graph image being wrong size
-   Fixed deprecated permission policy APIs
-   Fixed missing Sentry auth tokens in build
-   Fixed missing Sentry global error handler
-   Fixed missing `form_factor` in web manifest
-   Fixed missing alts on images
-   Fixed missing aria-labels for accessibility screen readers
-   Fixed missing roles for accessibility
-   Fixed publications not opening in new tab

## [2.0.6] - 2024-01-10

Feature:

-   Added error and 404 pages
-   Clicking name in navbar brings to socials component

Optimizations:

-   Applied anti-aliasing to everything
-   Applied image caching and remote patterns to Next.js configuration
-   Prefetched links
-   Refactored unnecessary code

## [2.0.5] - 2024-01-09

Data:

-   Updated resume

## [2.0.4] - 2024-01-08

Data:

-   Updated resume

Bug fix:

-   Fixed removing star node causing application error

## [2.0.3] - 2024-01-08

Bug fix:

-   Fixed "Sky" being capitalized in the Bluesky social icons
-   Fixed removing star node causing application error

## [2.0.2] - 2024-01-07

UI/UX:

-   Updated styling of socials icons and added more socials

Easter egg:

-   Added another easter egg (hint: check the web developer console log)

Bug fix:

-   Fixed analytics events not tracking correctly
-   Fixed email and resume appearing as a column when there was sufficient spacing to be in a row
-   Fixed spacing issue where profile picture was touching navbar

## [2.0.1] - 2024-01-05

UI/UX:

-   Added resume to footer
-   Added source code link to GitHub repository in footer

Analytics:

-   Added missing Google Analytic event tracking

## [2.0.0] - 2024-01-04

Updated to version 2.0.0! This is a major update that includes a complete redesign of the website.

## [1.1.1] - 2023-08-03

No longer supporting Internet Explorer.

UI/UX:

-   Updated tooltips styling

Optimization:

-   Added ESLint
-   Optimized images
-   Removed unnecessary lazy loading
-   Switched CSS to SASS
-   Updated web manifest

Security:

-   Addressed loader-utils security issue

Update:

-   Update packages
-   Updated OSSAR workflows

Documentation:

-   Added more documentation

Bug fix:

-   Fixed Small Dev Talk domain and URL issues
-   Fixed TypeError assignment to constant variable
-   Fixed failed service worker registration
-   Fixed incorrect links
-   Fixed issue with Firebase app being undefined
-   Fixed sneezing easter egg preservation warning

## [1.1.0] - 2022-11-02

A new update for my [personal portfolio](https://alexjsully.me/) has dropped!

Version 1.1.0 has now dropped which focuses primary on fixing bugs and optimizations.

Features:

-   Added Masterpiece Studio to portfolio
-   Now supports Internet Explorer 11

Optimization:

-   Added CI/CDs and GitHub Actions
-   Added high fetch priority to LCP images
-   Added missing accessibility landmarks
-   Added sandbox for iframe security
-   Addressed accessibility issues
-   Changed cookies to localstorage
-   Changed heading order for SEO optimizations
-   Compressed and optimized images and SVGs
-   Refactored code
-   Removed unused code
-   Updated PWA information
-   Updated metadata for SEO optimizations
-   Updated sitemap

Security:

-   Add http meta cache-control
-   Added Content Security Policy
-   Added Strict Transport Security
-   Updated general security overall

Update:

-   Update packages
-   Update service workers

Documentation:

-   Prettified code
-   Updated README

Bug fix:

-   Fixed 1 not valid aspect-ratio value
-   Fixed abstract ARIA roles
-   Fixed duplicate IDs and selectors
-   Fixed mobile UI for filtering

## [1.0.23] - 2021-11-09

Main release
