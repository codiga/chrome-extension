#!/bin/sh


rm -rf build
mkdir build
zip -r build/extension.zip background.js\
                     components \
                     content-script.js \
                     external \
                     icons \
                     manifest.json \
                     scripts
