/**
 * Exosite proxy library tests
 */

import { describe, it } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Exosite from '../src/Exosite';
import { AUTH0_TOKEN, API_SERVER, ROOT_RID } from './config';


chai.use(chaiAsPromised);
let expect = chai.expect;

describe('Exosite', () => {

  it('can instantiate', () => {
    let token = 'foo';
    let server = 'bar';
    let exosite = new Exosite(token);
    expect(exosite.userToken).to.be.equal(token);
    expect(exosite.apiServer).to.be.equal('https://proxy.exositeapp.com');
    exosite = new Exosite(token, server);
    expect(exosite.apiServer).to.be.equal(server);
  });

  it('can query device snapshot', (done) => {
    expect(AUTH0_TOKEN.length > 0, 'check that token exists');
    let exo = new Exosite(AUTH0_TOKEN, API_SERVER);
    exo.queryDevices({}, ['rid']).then(
      (result) => {
        console.log('result', result);
        result.should.equal([]);
        done();
      },
      (err) => {
        console.log('err', err);
        done(err);
      }
    );
    //let p = expect(exo.queryDevices({nonsense: 'foo'}));
    //return expect(Promise.resolve({ foo: "bar" })).to.eventually.have.property("foo");
    //return p.should.be.fulfilled;
  });

  it('can call RPC', (done) => {
    expect(AUTH0_TOKEN.length > 0, 'check that token exists');
    let exo = new Exosite(AUTH0_TOKEN, API_SERVER);
    exo.rpc({client_id: ROOT_RID}, [{
      procedure: 'info',
      arguments: [
        {alias: ''},
        {basic: true},
      ]
    }]).then(
      (result) => {
        console.log('result', result);
        result.should.equal('TODO');
        done();
      },
      (err) => {
        console.log('err', err);
        done(err);
      }
    );
    //let p = expect(exo.queryDevices({nonsense: 'foo'}));
    //return expect(Promise.resolve({ foo: "bar" })).to.eventually.have.property("foo");
    //return p.should.be.fulfilled;
  });

});
