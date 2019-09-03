const TodoModel = require('../model/todo.model');

const createTodo = async (req, res, next) => {
	try {
		const createdTodo = await TodoModel.create(req.body);
		res.status(201).json(createdTodo);
	} catch (err) {
		next(err);
	}
};

const getTodos = async (req, res, next) => {
	try {
		const allData = await TodoModel.find({});
		res.status(200).json(allData);
	} catch (error) {
		next(error);
	}
};

const getTodoById = async (req, res, next) => {
	try {
		const allData = await TodoModel.findById(req.params.todoId);
		if (!allData) return res.sendStatus(404);
		res.status(200).json(allData);
	} catch (error) {
		next(error);
	}
};

const updateTodo = async (req, res, next) => {
	try {
		const newItem = await TodoModel.findByIdAndUpdate(
			req.params.todoId,
			req.body,
			{
				new: true,
				useFindAndModify: false,
			},
		);
		if (!newItem) return res.sendStatus(404);
		res.json(newItem);
	} catch (error) {
		next(error);
	}
};

const deleteTodo = async (req, res, next) => {
	try {
		const deleted = await TodoModel.findByIdAndDelete(req.params.todoId);
		if (!deleted) return res.sendStatus(404);
		res.json(deleted);
	} catch (error) {
		next(error);
	}
};

module.exports = { createTodo, getTodos, getTodoById, updateTodo, deleteTodo };
