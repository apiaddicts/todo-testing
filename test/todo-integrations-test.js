
const supertest = require('supertest');

require ('../server.js');
const api = supertest('http://localhost:3001');

const chai = require('chai');
const expect = chai.expect;

const validator = require('./validate');

describe('TODO CRUD operatons', () => {
  describe('/POST', () => {
    it('should be able to save a new todo', (done) => {
      const newTodo = { todo: 'Create from integration test.' };
      api.post('/api/todos')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(newTodo)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          expect(validator.validate({
            path: '/todos',
            method: 'post',
            status: '201',
            value: res.body
          })).to.be.null;

          done();
        })
    })
  })
})