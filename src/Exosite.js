import request from '../node_modules/superagent/lib/client.js';

/**
 * Exosite Proxy API Library
 * Copyright (c) Exosite | The MIT License
 */
class Exosite {

  constructor(userToken, apiServer='https://api.exositeapp.com') {
    this.userToken = userToken;
    this.apiServer = apiServer;
  }

  rpc(auth, calls) {
    let that = this;
    return new Promise(function(resolve, reject) {
      request
        .post(that.apiServer + '/onep:v1/rpc/process')
        .set('Authorization', 'Bearer ' + that.userToken)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ auth: auth, calls: calls })
        .end(function(err, res) {
          if (res.ok && !err) {
            resolve(res.text);    
          } else {
            reject(err);
          }
        });
    });
  }

}

export default Exosite;
