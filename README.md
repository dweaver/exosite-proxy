# Exosite Fleet API

Javascript library for [Exosite](http://exosite.com)'s fleet management APIs, currently in beta.

## Usage

- add library and to your HTML. The library is dependent on jQuery and Auth0. Later it will not be. 

```
<head>
    <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
    <script src="http://cdn.auth0.com/w2/auth0-4.js"></script>
    <script src="https://github.com/dweaver/exosite-fleet/blob/master/src/Exosite.js"></script>
</head>
```

- use the library by requiring it

```
<script>
var fleet = require('exosite-fleet');
var exo = new fleet('API TOKEN');
exo.query({domain: "cloudy.exosite.com"}, ["model","name","sn"]).then(function(devices) {
  console.log(devices);
});
</script>
```


## Build for distribution

To build the build, do this:

```
$ npm build
npm build && cd src && browserify Exosite.js -t babelify -r ./Exosite:exosite-fleet -o ../exosite-fleet.js && cd .. && cp ./exosite-fleet.js ../fleet/scripts/exosite-fleet.js
$ uglifyjs exosite-fleet.js -o exosite-fleet.min.js
```
