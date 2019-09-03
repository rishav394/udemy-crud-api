var express = require('express');
var app = express();
const mongodb = require('./mongodb/mongodb.connect');
const todoRoutes = require('./routes/todo-routs');

mongodb.connect();

app.use(express.json());

app.use('/todos', todoRoutes);

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

app.get('/', (req, res) => {
	res.json('Hellow World!');
});

module.exports = app;
