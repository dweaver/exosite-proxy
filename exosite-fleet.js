require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"FXviCq":[function(require,module,exports){
/**
 * Exosite Fleet API Library
 * Copyright (c) Exosite | The MIT License
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Exosite = (function () {
  function Exosite(userToken, apiServer) {
    _classCallCheck(this, Exosite);

    this.API_SERVER = apiServer || 'https://fleet-prototype-api.herokuapp.com';
    // TODO: drop $ dependency
    $.ajaxSetup({
      beforeSend: function beforeSend(xhr) {
        if (userToken) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + userToken);
        }
      }
    });
  }

  _createClass(Exosite, [{
    key: 'query',
    value: function query(_query, selection, options) {
      var deferred = $.Deferred();

      var devices = $.ajax(this.API_SERVER + '/api/v1/Devices', {
        data: {
          query: JSON.stringify(_query),
          select: selection.join(',')
        }
      }).done(function (data) {
        deferred.resolve(data);
      }).fail(function (err) {
        deferred.reject(err);
      });
      return deferred.promise();
    }
  }, {
    key: 'rpc',
    value: function rpc(auth, calls) {
      var deferred = $.Deferred();
      results = $.ajax(this.API_SERVER + '/onep:v1/rpc/process', {
        type: 'POST',
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({
          auth: auth,
          calls: calls
        })
      }).done(function (response) {
        deferred.resolve(response);
      }).fail(function (err) {
        deferred.reject(err);
      });

      return deferred.promise();
    }
  }]);

  return Exosite;
})();

exports['default'] = Exosite;
module.exports = exports['default'];

},{}],"exosite-fleet":[function(require,module,exports){
module.exports=require('FXviCq');
},{}]},{},["FXviCq"])