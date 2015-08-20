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

  get(path, data) {
    var deferred = $.Deferred();
    var devices = $.ajax(
      this.apiServer + path,
      { data: data })
    .done(function(data) {
      deferred.resolve(data);
    })
    .fail(function(err) {
      deferred.reject(err);
    });
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
