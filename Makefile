PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.PHONY: clean

build:
	mkdir -p _build
	mkdir -p dist
	npm install
	npm build
	browserify src/Exosite.js -t babelify -r ./src/Exosite:exosite-proxy -o exosite-proxy.js
	uglifyjs exosite-proxy.js -o exosite-proxy.min.js

clean:
	rm exosite-proxy.js exosite-proxy.min.js

publish:
	cat package.json | jq .version | xargs git tag
	cat package.json | jq .version | xargs git push origin
	npm publish
