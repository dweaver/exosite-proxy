/**
 * Exosite Fleet API Library
 * Copyright (c) Exosite | The MIT License
 */
class Exosite {

  constructor(name) {
    this.name = name || 'Guest';
  }

  hello() {
    return `Welcome, ${this.name}!`;
  }

}

export default Exosite;
