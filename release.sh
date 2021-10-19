#!/bin/sh

find . -name '*~' | xargs rm -f
rm -rf node_modules
rm -rf build
mkdir build
rm -rf dist
mkdir dist
npm i
npm run build
(cd dist && zip -r ../build/extension.zip \
                     *.js\
                     *.ttf \
                     *.css \
                     *.png \
                     *.html \
                     js \
                     manifest.json \
                     scripts)
