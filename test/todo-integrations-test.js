
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
    });

    it('missing required property should return a 400 with status as false', (done) => {
      const newTodo = {task: 'New Todo'};
      api.post('/api/todos')
         .set('Accept', 'application/json')
         .set('Content-Type', 'application/json')
         .send(newTodo)
         .expect('Content-Type', /json/)
         .expect(400)
         .end((err, res) => {
            if (err) return done(err);

            expect(validator.validate({
              path: '/todos',
              method: 'post',
              status: '400',
              value: res.body
            })).to.be.null;

            expect(res.body.status).to.be.false;
            done();
          });
    });
  })

  describe('GET one todo', () => {
    let response = {};
    before((done) => {
      const newTodo = {todo: 'Todo from hooks'};
      api.post('/api/todos')
         .set('Accept', 'application/json')
         .set('Content-Type', 'application/json')
         .send(newTodo)
         .expect(201)
         .end((err, res) => {
           if (err) return done(err);

           response = res.body;
           done();
          });
    });

    it('/Get by id', (done) => {
			api.get(`/api/todos/${response.id}`)
         .set('Accept', 'application/json')
         .expect('Content-Type', /json/)
			   .expect(200)
         .end((err, res) => {
          if (err) return done(err);

          expect(validator.validate({
            path: '/todos/{id}',
            method: 'get',
            status: '200',
            value: res.body
          })).to.be.null;

          expect(res.body.id).to.eql(response.id);
          done();
        });
    });

    it('should return a 400 response with status as false', (done) => {
      api.get('/api/todos/aaaaa')
         .set('Accept', 'application/json')
         .expect('Content-Type', /json/)
			   .expect(400)
         .end((err, res) => {
          if (err) return done(err);

          expect(validator.validate({
            path: '/todos/{id}',
            method: 'get',
            status: '400',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.false;
          done();
         });
    });

    it('should return a 404 response with status as false', (done) => {
      api.get('/api/todos/123456789009876543211234')
         .set('Accept', 'application/json')
         .expect('Content-Type', /json/)
			   .expect(404)
         .end((err, res) => {
          if (err) return done(err);

          expect(validator.validate({
            path: '/todos/{id}',
            method: 'get',
            status: '404',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.false;
          done();
         });
    });

  })

  // Marcos: test de integración para eliminar un TODO con éxito
  describe('/DELETE a todo', () => {
    let response = {};

    before((done) => {
      const newTodo = { todo: 'Todo from delete integration test' };
      api.post('/api/todos')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(newTodo)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          response = res.body;
          done();
        });
    });

    it('should return 204 if a todo is deleted successfully', (done) => {
      api.delete(`/api/todos/${response.id}`)
        .set('Accept', 'application/json')
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);

          expect(validator.validate({
            path: '/todos/{id}',
            method: 'delete',
            status: '204',
            value: res.body
          })).to.be.null;

          expect(res.status).to.be.equal(204);
          done();
        });
    });
  });
})