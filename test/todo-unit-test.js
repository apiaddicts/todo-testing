
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

const { mockReq, mockRes } = require('sinon-express-mock');

const controller = require('../app/controllers/todo.controller');

const Todo = require('../app/models/todo');

chai.use(sinonChai);
const expect = chai.expect;

let TodoMock;
describe('TODO unit test', () => {
  describe('/POST a new todo', () => {

    it('should create a new post', (done) => {
      const expectedResult = { id: '1234', todo: 'example for test', created: Date.now(), completed: false };

      TodoMock = sinon.mock(Todo);
      TodoMock.expects('create').yields(null, expectedResult);

      const req = mockReq( { body: { todo: 'example for test'} });
      const res = mockRes();

      controller.PostTodo(req, res);

      TodoMock.verify();
      expect(res.status).to.be.calledWith(201);
      expect(res.json).to.be.calledWith(expectedResult);

      done();
    });

    it('should return error', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('create').yields(new Error(), null);

      const req = mockReq( { body: { todo: 'example for test'} });
      const res = mockRes();

      controller.PostTodo(req, res);

      TodoMock.verify();
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledWith({ status: false, message: 'Error creating document in mongo.' });

      done();
    });

    it('should return bad request if todo is invalid', (done) => {
      const req = mockReq( { body: { task: 'example for test'} });
      const res = mockRes();

      controller.PostTodo(req, res);
      expect(res.status).to.be.calledWith(400);
      expect(res.json).to.be.calledWith({ status: false, message: 'bad request.' });

      done();
    });

    afterEach( () => {
      TodoMock.restore();
    })
  });

  describe('/GET todos', () => {
    it('GET all', (done) => {
      const expectedResult = [];
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('find').yields(null, expectedResult);

      const req = mockReq();
      const res = mockRes();

      controller.GetTodos(req, res);

      TodoMock.verify();
      expect(res.json).to.be.calledWith(expectedResult);

      done();
    });

    it('GET all should return bad request if status is invalid', (done) => {
      const req = mockReq({ query: {
        status: 'todos'
      }});
      const res = mockRes();

      controller.GetTodos(req, res);

      expect(res.status).to.be.calledWith(400);
      expect(res.json).to.be.calledWith({ status: false, message: 'bad request.' });

      done();
    });

    it('should return error', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('find').yields(new Error(), null);

      const req = mockReq();
      const res = mockRes();

      controller.GetTodos(req, res);

      TodoMock.verify();
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledWith({ status: false, message: 'Internal server error' });

      done();
    });

    afterEach( () => {
      TodoMock.restore();
    })
  });
})