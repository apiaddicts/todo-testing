
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

    it('GET all completed', (done) => {
      const expectedResult = [];
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('find').yields(null, expectedResult);

      const req = mockReq({
        query: { status: 'completed' }
      });
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

  describe('/GET a todo', () => {

    it('should fetch a todo', (done) => {
      TodoMock = sinon.mock(Todo);
      const expectedMongoResult = { id: "", todo: "", created: '2021-05-26T13:00:00', completed: false };
      TodoMock.expects('findOne').yields(null, expectedMongoResult);

      const req = mockReq({ params: { id: '123456789012345678901234' } });
      const res = mockRes();

      controller.GetOneTodo(req, res);

      TodoMock.verify();
      expect(res.json).to.be.calledWith({status: true, todo: expectedMongoResult});

      done();
    });

    it('should return error if we can not get a todo', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('findOne').yields(new Error(), null);

      const req = mockReq({ params: { id: '123456789012345678901234' } });
      const res = mockRes();

      controller.GetOneTodo(req, res);

      TodoMock.verify();
      expect(res.status).to.be.calledWith(500);

      done();
    });

    it('should return bad request if id is invalid', (done) => {
      const req = mockReq({ params: { id: '123' } });
      const res = mockRes();

      controller.GetOneTodo(req, res);
      expect(res.status).to.be.calledWith(400);

      done();
    });

    it('should return not found if we can not get a todo', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('findOne').yields(null, null);

      const req = mockReq({ params: { id: '123456789012345678901234' } });
      const res = mockRes();

      controller.GetOneTodo(req, res);

      TodoMock.verify();
      expect(res.status).to.be.calledWith(404);

      done();
    });

    afterEach( () => {
      TodoMock.restore();
    })
  })

  describe('/PATCH a todo by id', () => {
    it('should patch a todo', (done) => {
      TodoMock = sinon.mock(Todo);
      const expectedMongoPatchResult = { id: "123456789012345678901234", todo: "example 1", created: '2021-05-13T15:30:00', completed: false };

      TodoMock.expects('findOneAndUpdate').yields(null, expectedMongoPatchResult);

      const req = mockReq({
        params: { id: '123456789012345678901234' },
        body: { todo: 'example 1' }
      });
      const res = mockRes();

      controller.UpdateTodo(req, res);

      TodoMock.verify();
      expect(res.json).to.be.calledWith({status: true, todo: expectedMongoPatchResult});

      done();
    });

    it('should return error if we can not patch a todo', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('findOneAndUpdate').yields(new Error(), null);

      const req = mockReq({
        params: { id: '123456789012345678901234' },
        body: { todo: 'example 1' }
      });
      const res = mockRes();

      controller.UpdateTodo(req, res);

      TodoMock.verify();
      expect(res.status).to.be.calledWith(500);

      done();
    });

    it('should return bad request if id is invalid', (done) => {
      const req = mockReq({
        params: { id: '1234' },
        body: { todo: 'example 1' }
      });
      const res = mockRes();

      controller.UpdateTodo(req, res);
      expect(res.status).to.be.calledWith(400);

      done();
    });

    it('should return bad request if todo is invalid', (done) => {
      const req = mockReq({
        params: { id: '123456789012345678901234' },
        body: { completed: 'example 1' }
      });
      const res = mockRes();

      controller.UpdateTodo(req, res);
      expect(res.status).to.be.calledWith(400);

      done();
    });

    it('should return not found if todo not exist', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('findOneAndUpdate').yields(null, null);

      const req = mockReq({
        params: { id: '123456789012345678901234' },
        body: { completed: true }
      });
      const res = mockRes();

      controller.UpdateTodo(req, res);

      TodoMock.verify();
      expect(res.status).to.be.calledWith(404);

      done();
    });

    afterEach( () => {
      TodoMock.restore();
    })
  })

  describe('/DELETE by id', () => {
    it('should delete a todo by id', function(done) {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('remove').withArgs({_id: '123456789012345678901234'}).yields(null, {
        result: { n: 1 }
      });

      const req = mockReq({ params: { id: '123456789012345678901234' } });
      const res = mockRes();

      controller.DeleteTodo(req, res);

      TodoMock.verify();
      expect(res.status).to.be.calledWith(204);

      done();
    });

    it('should return an error if todo is not deleted', function(done) {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('remove').withArgs({_id: '123456789012345678901234'}).yields(new Error(), null);

      const req = mockReq({ params: { id: '123456789012345678901234' } });
      const res = mockRes();

      controller.DeleteTodo(req, res);

      TodoMock.verify();
      expect(res.status).to.be.calledWith(500);

      done();
    });

    it('should return bad request if id is invalid', function(done) {
      const req = mockReq({ params: { id: '123456' } });
      const res = mockRes();

      controller.DeleteTodo(req, res);
      expect(res.status).to.be.calledWith(400);

      done();
    });

    it('should return not found if todo not exist', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('remove').withArgs({_id: '123456789012345678901234'}).yields(null, {
        result: { n: 0 }
      });

      const req = mockReq({ params: { id: '123456789012345678901234' } });
      const res = mockRes();

      controller.DeleteTodo(req, res);

      TodoMock.verify();
      expect(res.status).to.be.calledWith(404);

      done();
    });

    afterEach( () => {
      TodoMock.restore();
    })
  })
})