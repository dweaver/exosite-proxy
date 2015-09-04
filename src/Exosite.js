import request from '../node_modules/superagent/lib/client.js';

/**
 * Exosite Fleet API Library
 * Copyright (c) Exosite | The MIT License
 */
class Exosite {

  constructor(userToken, apiServer='https://fleet-prototype-api.herokuapp.com') {
    this.userToken = userToken;
    this.apiServer = apiServer;
  }

  /**
   * General query function for fleet API's query endpoints
   */
  q(what, query, selection, options) {
    let that = this;
    let params = {
      query: JSON.stringify(query)
    };
    if (selection) {
      params.select = selection.join(',');
    }
    if (options) {
      if (options.limit) {
        params.limit = options.limit;
      }
      if (options.sort) {
        params.sort = options.sort;
      }
    }
     
    return new Promise(function(resolve, reject) {
      request
        .get(that.apiServer + '/api/v1/' + what)
        .query(params)
        .set('Authorization', 'Bearer ' + that.userToken)
        .end(function(err, res) {
          if (res.ok && !err) {
            resolve(res.body);    
          } else {
            console.log('reject', res.text);
            reject(res.text);
          }
        });
    });
  }

  queryDevices(query, selection, options) {
    return this.q('Devices', query, selection, options);
  }

  queryUsers(query, selection, options) {
    return this.q('Users', query, selection, options);
  }

  queryDomains(query, selection, options) {
    return this.q('Domains', query, selection, options);
  }

  rpc(auth, calls) {
    let that = this;
    return new Promise(function(resolve, reject) {
      request
        .post(that.apiServer + '/onep:v1/rpc/process')
        .set('Authorization', 'Bearer ' + that.userToken)
        .send({ auth: auth, calls: calls })
        .end(function(err, res) {
          if (res.ok && !err) {
            resolve(res.body);    
          } else {
            reject(res.text);
          }
        });
    });
  }

}

export default Exosite;
