const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert').strict;

const rest = require('../rest/rest');

Given('A Todo {}', function (request) {
  this.context['request'] = JSON.parse(request);
});

When('I send POST to {}', async function (path) {
  this.context['response'] = await rest.postData(`http://localhost:3001/api${path}`, this.context['request'])
});

Then('I get response code and schema {int}', function (code) {
  assert.equal(this.context['response'].status, code);
});

