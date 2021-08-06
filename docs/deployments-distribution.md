# Deployments and Distribution

This document will detail the steps required to publish an working Expo application under the managed flow.

## Prerequisites

1. Install `npm install -g expo-cli eas-cli`
1. Login with your Expo account `expo-cli login`
1. Verify you're logged in: `expo-cli whoami`

## Steps

- Run `expo build:ios -t simulator` -- say yes when it prompts you about `expo build:ios currently only supports managed workflow apps.`
- Run `expo publish --target managed --release-channel alpha` to publish an alpha build to Expo Go

## Handy Links

- [Apple Developer](https://developer.apple.com/account/#!/overview/L32MAH253N)
  - User `L32MAH253N`
- [Expo Dashboard for `compassionapp`](https://expo.dev/accounts/compassionapp/projects/Compassion/)
  - [Builds](https://expo.dev/accounts/compassionapp/projects/Compassion/builds)

## Resources

- https://docs.expo.dev/distribution/building-standalone-apps/
