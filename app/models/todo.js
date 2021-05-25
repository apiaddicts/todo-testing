const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TodoSchemo = new Schema({
  todo: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('Todo', TodoSchemo);
module.exports = Todo;
