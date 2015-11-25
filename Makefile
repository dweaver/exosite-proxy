PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.PHONY: clean

build:
	mkdir -p _build
	mkdir -p dist
	npm install
	npm build
	browserify src/Exosite.js -t babelify -o _build/exosite-proxy.js
	uglifyjs _build/exosite-proxy.js -o dist/exosite-proxy.min.js

clean:
	rm -rf _build
	rm -rf dist

publish:
	cat package.json | jq .version | xargs git tag
	cat package.json | jq .version | xargs git push origin
	npm publish
