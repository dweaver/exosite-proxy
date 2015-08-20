import Http from './Http.js';

/**
 * Exosite Fleet API Library
 * Copyright (c) Exosite | The MIT License
 */
class Exosite {

  constructor(userToken, apiServer='https://fleet-prototype-api.herokuapp.com') {
    this.http = new Http(userToken, apiServer);
  }

  /**
   * General query function for fleet API's query endpoints
   */
  q(what, query, selection, options) {
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
     
    return this.http.get('/api/v1/' + what, data);
  }

  queryDevices(query, selection, options) {
    return this.q('Devices', query, selection, options);
  }

  queryUsers(query, selection, options) {
    return this.q('Users', query, selection, options);
  }

  rpc(auth, calls) {
    return Http.post('/onep:v1/rpc/process', { auth: auth, calls: calls });
  }

}

export default Exosite;
