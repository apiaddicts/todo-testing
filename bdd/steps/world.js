require('../../server');
const { setWorldConstructor, World } = require('@cucumber/cucumber');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.context = { test: 1 };
  }
}

setWorldConstructor(CustomWorld);