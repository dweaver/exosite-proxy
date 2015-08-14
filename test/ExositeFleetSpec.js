/**
 * Exosite Fleet library tests
 */

import { describe, it } from 'mocha';
import { expect } from 'chai';
import Exosite from '../src/Exosite';

describe('Exosite', () => {

  it('Can say hello', () => {
    const exosite = new Exosite();
    const message = exosite.hello();
    expect(message).to.be.equal('Welcome, Guest!');
  });

});
