# Civilization 6 Drafter

[![Build Status](https://img.shields.io/github/actions/workflow/status/jakezatecky/civ-6-drafter/main.yml?branch=main&style=flat-square)](https://github.com/jakezatecky/civ-6-drafter/actions/workflows/main.yml)

> A modern, mobile-friendly drafting tool for Sid Meier's Civilization 6.

## Local Deployment

```
npm run dev-server
```

## Remote Deployment

### Configuration

Create an IAM user with CLI access and then create a `civilization` profile:

```
$ aws configure --profile civilization
AWS Access Key ID [None]: accesskey
AWS Secret Access Key [None]: secretkey
Default region name [None]: us-east-1
Default output format [None]:
```

### Push to S3

```
npm run deploy
```
