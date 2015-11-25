PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.PHONY: clean

build:
	npm install
	npm build
	browserify src/index.js -t babelify -o exosite-proxy.js
	uglifyjs exosite-proxy.js -o exosite-proxy.min.js

clean:
	rm exosite-proxy.js exosite-proxy.min.js

publish:
	cat package.json | jq .version | xargs git tag
	cat package.json | jq .version | xargs git push origin
	npm publish
