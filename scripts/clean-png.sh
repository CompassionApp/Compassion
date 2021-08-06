#!/bin/sh

# Cleans the alpha channel from asset PNGs
# See: https://github.com/expo/fyi/blob/master/remove-alpha-channel.md

GIT_PATH=$(git rev-parse --show-toplevel)
ASSETS_DIR=$GIT_PATH/assets

convert $ASSETS_DIR/icon.png -background black -alpha remove -alpha off $ASSETS_DIR/icon.png

# Optimize all images
# https://docs.expo.dev/distribution/optimizing-updates/#optimize-images
npx expo-optimize