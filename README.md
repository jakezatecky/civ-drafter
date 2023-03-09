# Civilization Drafter

[![Build Status](https://img.shields.io/github/actions/workflow/status/jakezatecky/civ-drafter/main.yml?branch=main&style=flat-square)](https://github.com/jakezatecky/civ-drafter/actions/workflows/main.yml)
[![GitHub license](https://img.shields.io/badge/license-GPLv3-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jakezatecky/civ-drafter/main/COPYING)

> A modern, mobile-friendly drafting tool for Sid Meier's Civilization VI.

## About

**Civilization Drafter** is a [web application](https://civilizationdrafter.com/) that allows users to draft from a random set of civilizations for multiplayer play. It supports all DLC leaders from Civilization VI and is freely available under the [GPLv3 license](https://raw.githubusercontent.com/jakezatecky/civ-drafter/main/COPYING).

### Features

* Ban specific leaders
* Copy results to the clipboard as an image (requires Chromium or Webkit browser)
* Support for the latest leaders, up to the [Leader Pass](https://civilization.fandom.com/wiki/Civilization_VI:_Leader_Pass) DLC
* Remembers draft settings when returning to the site
* Restrict DLC leaders to certain players
* Light and dark themes (defaults to system setting)
* Clean, accessible, and mobile-friendly design
* Installable as a Progressive Web App

## Support the Project

Web hosting is not free, and development takes time and passion. If you found this application useful, please consider [making a donation](https://ko-fi.com/onyxfox) or [becoming a supporter](https://patreon.com/civdrafter).

## Deployment

The following assumes you have Git, Node.js, and Yarn installed.

### Local Deployment

```
yarn install
npm run dev-server
```

### Remote Deployment

This application is a static website and is thus ideal for deployment to S3 or Cloudflare. The current application sits on S3, although that might change in the future.

#### AWS Configuration

Create an IAM user with CLI access and then create a `civilization` profile:

```
$ aws configure --profile civilization
AWS Access Key ID [None]: accesskey
AWS Secret Access Key [None]: secretkey
Default region name [None]: us-east-1
Default output format [None]:
```

#### Pushing to S3

```
npm run deploy
```
