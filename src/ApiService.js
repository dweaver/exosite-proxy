var _ = require('lodash');
import request from '../node_modules/superagent/lib/client.js';

class ApiService {

    constructor(token, apiServer='https://proxy.exositeapp.com') {
        this.token      = token;
        this.apiServer  = apiServer;
        this.apiRootUri = '/api/onep:v1/rpc/process';
    }

    buildRequest() {
        return request
            .post(this.apiServer + this.apiRootUri)
            .set('Authorization', 'Bearer ' + this.token)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
    }

    rpc(clientId, calls) {
        // clientId is optional, so shift the arguments if it wasn't provided
        if (_.isArray(clientId)) {
            calls     = clientId;
            clientId  = null;
        }
        // Add unique id to each call
        calls = _.map(calls, (call, i)  => {
            call['id'] = i + 1;
            return call;
        });
        // Compose request
        var requestObj = null;
        if (clientId == null) {
            requestObj = { calls: calls };
        } else {
            requestObj = { auth: { client_id: clientId }, calls: calls };
        }

        return new Promise((resolve, reject) => {
            this.buildRequest()
                .send(requestObj)
                .end((err, res) => {
                    if (res.ok && !err) {
                        resolve(JSON.parse(res.text));
                    } else {
                        reject(err);
                    }
                });
        });
    }

    getTimeSeries(deviceId, dataportRid, limit, since, onSuccess, onError) {
        // Compose request
        var auth = { 'cik': deviceId };
        var requestObj = {
            auth:  auth,
            calls: [{ id: 0, procedure: 'read', arguments: [dataportRid, {limit: limit}]}]
        };

        return new Promise((resolve, reject) => {
            this.buildRequest()
                .send(requestObj)
                .end((err, res) => {
                    console.log(err, res);
                    if (res.ok && !err) {
                        resolve(res.text);
                    } else {
                        reject(err);
                    }
                });
        });
    }

    // Helper function which retrieves device metadata after getting a listing of device clients
    getDeviceInfo(data) {
        var clients = data[0].result.client;
        if (clients.length === 0) {
            return [];
        } else {
            var attrs = { description: true, key: true, tags: true, basic: true, subscribers: true, shares: true, aliases: true};
            var calls = _.map(clients, (client) => {
                return { procedure: 'info', arguments: [client, attrs] };
            });
            return this.rpc(calls).then(
                (data) => {
                    var zipped    = _.zip(data, clients);
                    data = _.map(zipped, (tuple) => {
                        var device = tuple[0].result;
                        device['client_id'] = tuple[1];
                        if (device.description.meta) {
                            device.description.meta = JSON.parse(device.description.meta);
                        } else {
                            device.description.meta = {};
                        }
                        return device;
                    });
                    return data;
                },
                (response) => {
                    console.log('error', response);
                }
            );
        }
    }

    getDeviceChildren(data) {
        if (data) {
            var calls = _.map(data, (device) => {
                var call = {
                    procedure: 'listing',
                    arguments: [{'alias': ''}, ['dataport', 'datarule', 'dispatch', 'client'], {}]
                };
                return this.rpc(device['client_id'], [call])
                        .then((data) => {
                                var children = data[0].result;
                                return _.merge(device, children);
                            },
                            (r) => { console.log(r); });
            });
            return Promise.all(calls);
        } else {
            return null;
        }
    }

    mapReads(device, rids, resources) {
        if (!_.isArray(resources)) {
            return device;
        }
        var resources = _.map(_.zip(rids, _.chunk(resources, 2)), (resourceTuple) => {
            var rid  = resourceTuple[0];
            var info = resourceTuple[1][0].result;
            var read = resourceTuple[1][1].result;
            info['rid'] = rid;
            if (info.description.meta) {
                info.description.meta = JSON.parse(info.description.meta);
            } else {
                info.description.meta = {};
            }
            if (read.length > 0) {
                info['currentValue'] = {
                    timestamp: read[0][0],
                    value:     read[0][1]
                };
            } else {
                info ['currentValue'] = null;
            }
            return info;
        });
        _.forEach(['dataport', 'datarule', 'dispatch', 'client'], (key) => {
            device[key] = [];
        });
        _.forEach(resources, (resource) => {
            device[resource.basic.type].unshift(resource);
        });
        return device;
    }

    getDeviceChildrenInfo(devices) {
        var devicesWithRids = _.map(devices, (device) => {
            return {
                device: device,
                cik:    device['client_id'],
                rids: _.flatten(_.map(
                    _.zip(device.dataport, device.datarule, device.dispatch, device.client),
                    (rids) => {
                        return _.filter(rids, (rid) => { return typeof rid === 'string'; });
                    }
                ))
            };
        });
        var requests = _.map(devicesWithRids, (device) => {
            var calls = _.map(device.rids, (rid) => {
                var infoAttrs = {
                    "description": true, "key": true, "tags": true, "basic": true, "subscribers": true, "shares": true, "aliases": true
                };
                return [{
                    procedure: 'info',
                    arguments: [rid, infoAttrs]
                }, {
                    procedure: 'read',
                    arguments: [rid, {limit: 1}]
                }];
            });
            var flattenedCalls = _.flatten(calls);
            if (flattenedCalls.length) {
                return this.rpc(device.cik, flattenedCalls)
                        .then((r) => { return this.mapReads(device.device, device.rids, r.data); },
                                (r) => { console.log('clientReadRequestError', r); });
            } else {
                return new Promise((resolve, reject) => { resolve(this.mapReads(device.device, device.rids, [])); });
            }
        });
        return Promise.all(requests);
    }

    getDevices(onSuccess, onError) {
        var args = [{'alias': ''}, ['client'], { owned: true }];
        var calls = [
            { procedure: 'listing', arguments: args }
        ];
        return this.rpc(calls)
            .then(this.getDeviceInfo.bind(this), onError)
            .then(this.getDeviceChildren.bind(this), onError)
            .then(this.getDeviceChildrenInfo.bind(this), onError)
            .then((devices) => { onSuccess(devices); },
                  (err)     => { onError(err); });
    }
}

export default ApiService;
