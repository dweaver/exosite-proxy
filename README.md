# Exosite Proxy API

Javascript library for [Exosite](http://exosite.com)'s proxy API, currently in beta.

## Usage

Add library and dependencies to your HTML. The library is dependent on Auth0 (for tokens).

```
<head>
    <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
    <script src="http://cdn.auth0.com/w2/auth0-4.js"></script>
    <script>
      authProvider.init({
        domain: 'exositeapp.auth0.com',
        clientID: 'dcnod3KP9Hn40y0VWbmKLVRODQ9I12xv'
      });
    </script>
    <script src="https://rawgit.com/dweaver/exosite-proxy/master/exosite-proxy.js"></script>
</head>
```

Use the library by requiring it:

```
<script>
var proxy = require('exosite-proxy');
var exo = new proxy('API TOKEN');
exo.queryDevices({domain: "cloudy.exosite.com"}, ["model","name","sn"]).then(function(devices) {
  console.log(devices);
});
</script>
```

For a working example, look here: https://github.com/dweaver/exosite-proxy-example


## Build for distribution

To build, do this:

```
$ make build
```

For debugging, you may want to copy it into a different project:
```
$ make build
$ cp _build/exosite-proxy.js ../proxy/scripts/exosite-proxy.js
```

To distribute, update version number in package.json and bower.json. Then do this:

```
$ make publish
```

This will automatically tag the release, push to master, and call `npm publish`
