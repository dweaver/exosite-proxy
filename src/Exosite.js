/**
 * Exosite Fleet API Library
 * Copyright (c) Exosite | The MIT License
 */
class Exosite {

  constructor(apiServer, userToken) {
    this.API_SERVER = apiServer || 'https://fleet-prototype-api.herokuapp.com';
    this.name = name || 'Guest';
    // TODO: drop $ dependency
    $.ajaxSetup({
      beforeSend: function(xhr) {
        if (userToken) {
          xhr.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('userToken'));
        }
      }
    });
  }

  query(query, selection, options) {
    var deferred = $.Deferred();
     
    devices = $.ajax(
        API_SERVER + '/api/v1/Devices',
        {
          data: {
            query: query,
            select: selection
          }
        })
      .done(function(data) {
        deferred.resolve(data);
      })
      .fail(function(err) {
        deferred.reject(err);
      });
    return deferred.promise();
  }

  rpc(auth, calls) {
    var deferred = $.Deferred();
    results = $.ajax(
      API_SERVER + '/onep:v1/rpc/process',
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
