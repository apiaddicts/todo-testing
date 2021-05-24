
const swaggerTest = require('driven-swagger-test/src/swagger');

describe('Definition testing', () => {
  it('I can run all definition test', done => {
    swaggerTest('app/swagger/todo-swagger.yaml')
      .then(results => {
        const errors = results.tests.definition.some(result => result.code >= 5000);
        if (errors) { done(new Error('Errors in test')); return; }

        done();
      });
  })
})