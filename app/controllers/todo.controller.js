const Todo = require('../models/todo');
const schema = require('../swagger/schema');

const TodoCtrl = {
  PostTodo: (req, res) =>{
    const error = schema.validate({
      path: '/todos',
      method: 'post',
      parameter: 'task',
      value: req.body
    });

    if (error) return res.status(400).json({ status: false, message: 'bad request.' });

    Todo.create(req.body, (err, todo) => {
      if (err) return res.status(500).json({ status: false, message: 'Error creating document in mongo.' });

      return res.status(201).json({
        id: todo.id,
        todo: todo.todo,
        created: todo.created,
        completed: todo.completed
      });
    });
  },
  GetTodos: (req, res) => {
    let filter = {};
    if (req.query.status) {
      const error = schema.validate({
        path: '/todos',
        method: 'get',
        parameter: 'status',
        value: req.query.status
      });
      if (error) return res.status(400).json({ status: false, message: 'bad request.' });
      filter = { completed: req.query.status === 'completed' };
    }

    Todo.find(filter, (err, todos) => {
      if (err) return res.status(500).json({ status: false, message: 'Internal server error'});

      return res.json(todos.map(todo => ({
        id: todo.id,
        todo: todo.todo,
        created: todo.created,
        completed: todo.completed
      })));
    })
  },
  GetOneTodo: (req, res) => {
    const error = schema.validate({
      path: '/todos/{id}',
      method: 'get',
      parameter: 'id',
      value: req.params.id
    });
    if (error) return res.status(400).json({ status: false, message: 'bad request.' });

    Todo.findOne({ _id: req.params.id }, (err, todo) => {
      if (err) return res.status(500).json({status: false, message: 'internal server error'});
      if (todo === null) return res.status(404).json({status: false, message: 'not found'});

      return res.json({
        id: todo.id,
        todo: todo.todo,
        created: todo.created,
        completed: todo.completed
      });
    });
  },
  UpdateTodo: (req, res) => {
    const error = schema.validate({
      path: '/todos/{id}',
      method: 'patch',
      parameter: 'task',
      value: req.body
    });
    if (error) return res.status(400).json({ status: false, message: 'bad request.' });

    const bodyError = schema.validate({
      path: '/todos/{id}',
      method: 'patch',
      parameter: 'id',
      value: req.params.id
    });
    if (bodyError) return res.status(400).json({ status: false, message: 'bad request.' });

    Todo.findOneAndUpdate({_id: req.params.id}, req.body, { new: true}, (err, todo) => {
      if (err) return res.status(500).json({status: false, error: err.message});
      if (todo === null) return res.status(404).json({status: false, error: 'Not found'});

      return res.json({status: true, todo: {
        id: todo.id,
        todo: todo.todo,
        created: todo.created,
        completed: todo.completed
      }});
    });
  },
  DeleteTodo: (req, res) => {
    const idError = schema.validate({
      path: '/todos/{id}',
      method: 'delete',
      parameter: 'id',
      value: req.params.id
    });
    if (idError) return res.status(400).json({status: false, error: idError.message});

    Todo.remove({_id: req.params.id}, (err, todo) => {
      if (err) return res.status(500).json({status: false, error: err.message});
      if (todo.result.n === 0) return res.status(404).json({status: false, error: 'Not found.'});

      return res.status(204).end();
    });
  }
}

module.exports = TodoCtrl;