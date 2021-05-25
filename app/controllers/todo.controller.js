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

      return res.status(201).json(todo);
    });
  },
  GetTodos: (req, res) => {
    const error = schema.validate({
      path: '/todos',
      method: 'get',
      parameter: 'status',
      value: req.query.status
    });
    if (error) return res.status(400).json({ status: false, message: 'bad request.' });

    Todo.find({}, (err, todos) => {
      if (err) return res.status(500).json({ status: false, message: 'Internal server error'});

      return res.json(todos);
    })
  }
}

module.exports = TodoCtrl;