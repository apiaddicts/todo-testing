const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const mongoose = require('mongoose');

const app = express();
const todos = require('./app/routes/todo.routes');
const config = require('./app/config/config');

app.use(morgan('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}));
// parse application/json
app.use(bodyParser.json());

app.use('/api', todos);


// express application will listen to port mentioned in our configuration
app.listen(config.port, (err) => {
  if (err) throw err;
  console.log("App listening on port " + config.port);
});
