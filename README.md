# Civilization Drafter

[![Build Status](https://img.shields.io/github/actions/workflow/status/jakezatecky/civ-drafter/main.yml?branch=main&style=flat-square)](https://github.com/jakezatecky/civ-drafter/actions/workflows/main.yml)
[![GitHub license](https://img.shields.io/badge/license-GPLv3-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jakezatecky/civ-drafter/main/COPYING)

> A modern, mobile-friendly drafting tool for Sid Meier's Civilization VI.

## About

[**Civilization Drafter**](https://civilizationdrafter.com/) is a web application that allows users to draft from a random set of civilizations for multiplayer play. It supports all Civilization VI leaders, up to the [Leader Pass](https://civilization.fandom.com/wiki/Civilization_VI:_Leader_Pass) DLC, and is freely available under the [GPLv3 license](https://raw.githubusercontent.com/jakezatecky/civ-drafter/main/COPYING).

### Features

* Ban specific leaders
* Copy results to the clipboard as an image (requires Chromium or Webkit browser)
* Remembers draft settings when returning to the site
* Restrict DLC leaders to certain players
* Change the names of players
* Options to allow duplicate civilizations and leaders
* Light and dark themes (defaults to system setting)
* Clean, accessible, and mobile-friendly design
* Installable as a Progressive Web App

## Support the Project

Web hosting is not free, and development takes time and passion. If you found this application useful, please consider [making a donation](https://ko-fi.com/onyxfox).

## Deployment

The following assumes you have Git, Node.js, and Yarn installed.

### Local Deployment

```
yarn install
npm run dev-server
```

### Remote Deployment

This application is a static website and is thus ideal for deployment to Cloudflare, S3, and other hosts. Whatever provider you are using, make sure to run the following command to build the production version of the application:

```
npm run release-prod
```
