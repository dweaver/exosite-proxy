/**
 * Exosite Fleet API Library
 * Copyright (c) Exosite | The MIT License
 */
class Exosite {

  constructor(userToken, apiServer) {
    this.API_SERVER = apiServer || 'https://fleet-prototype-api.herokuapp.com';
    // TODO: drop $ dependency
    $.ajaxSetup({
      beforeSend: function(xhr) {
        if (userToken) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + userToken);
        }
      }
    });
  }

  q(what, query, selection, options) {
    var deferred = $.Deferred();

    var data = {
      query: JSON.stringify(query)
    };
    if (selection) {
      data.select = selection.join(',');
    }
    if (options) {
      if (options.limit) {
        data.limit = options.limit;
      }
      if (options.sort) {
        data.sort = options.sort;
      }
    }
     
    var devices = $.ajax(
      this.API_SERVER + '/api/v1/' + what,
      { data: data })
    .done(function(data) {
      deferred.resolve(data);
    })
    .fail(function(err) {
      deferred.reject(err);
    });
    return deferred.promise();
  }

  queryDevices(query, selection, options) {
    return this.q('Devices', query, selection, options);
  }

  queryUsers(query, selection, options) {
    return this.q('Users', query, selection, options);
  }

  rpc(auth, calls) {
    var deferred = $.Deferred();
    results = $.ajax(
      this.API_SERVER + '/onep:v1/rpc/process',
      {
        type: 'POST',
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({
          auth: auth,
          calls: calls
        })
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

export default Exosite;
