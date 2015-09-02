/**
 * Make HTTP requests.
 * Copyright (c) Exosite | The MIT License
 */
class Http {
  constructor(userToken, apiServer) {
    this.apiServer = apiServer;
    // TODO: drop $ dependency
    $.ajaxSetup({
      beforeSend: function(xhr) {
        if (userToken) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + userToken);
        }
      }
    });

  }

  /**
   * URL encode an object
   */
  param(object) {
      var encodedString = '';
      for (var prop in object) {
          if (object.hasOwnProperty(prop)) {
              if (encodedString.length > 0) {
                  encodedString += '&';
              }
              encodedString += encodeURI(prop + '=' + object[prop]);
          }
      }
      return encodedString;
  }

  get(path, data) {
    var deferred = $.Deferred();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path + this.param(data));
    xhr.onload = function() {
      if (xhr.status === 200) {
        deferred.resolve(xhr.responseText);
      } else {
        deferred.reject(xhr.status, xhr);
      }
    };
    return deferred.promise();
  }

  post(path, data) {
    var deferred = $.Deferred();
    results = $.ajax(
     this.API_SERVER + path,
      {
        type: 'POST',
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(data)
      })
    .done(function(response) {
      deferred.resolve(response);
    })
    .fail(function(err) {
      deferred.reject(err); 
    });

    return deferred.promise();
  }


}

export default Http;
