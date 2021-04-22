#!/bin/sh
TYPE_PATH=${1:-app/types/*.ts}
TYPE_NAME=${2:-LatLng}

./node_modules/.bin/ts-json-schema-generator \
  --path $TYPE_PATH \
  --type $TYPE_NAME \
  -o app/types/$TYPE_NAME.schema.json \
  -f tsconfig.json \
  --no-ref-encode \
  --no-top-ref \
  -e none

