# Civilization Drafter

[![Build Status](https://img.shields.io/github/actions/workflow/status/jakezatecky/civ-drafter/main.yml?branch=main&style=flat-square)](https://github.com/jakezatecky/civ-drafter/actions/workflows/main.yml)
[![GitHub license](https://img.shields.io/badge/license-GPLv3-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jakezatecky/civ-drafter/main/COPYING)

> A modern, mobile-friendly drafting tool for Sid Meier's Civilization VI.

## About

**Civilization Drafter** is a [web-based application](https://civilizationdrafter.com/) that allows users to draft from a random set of civilizations for multiplayer play. It supports all the latest leaders from Civilization VI. It is freely available under the [GPLv3 license](https://raw.githubusercontent.com/jakezatecky/civ-drafter/main/COPYING).

### Features

* Ability to ban specific leaders
* Support for latest leaders, up to the [Leader Pass](https://civilization.fandom.com/wiki/Civilization_VI:_Leader_Pass) DLC
* Mobile-first web design
* Light and dark themes
* Clean, accessible, and aesthetic look

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
