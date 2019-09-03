const TodoController = require('../../controllers/todo-controller');
const TodoModel = require('../../model/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock/newTodo.json');
const allTodos = require('../mock/all-todos.json');

jest.mock('../../model/todo.model');

let req, res, next;
beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
	next = jest.fn();
});

describe('TodoController.createTodo', () => {
	beforeEach(() => {
		req.body = newTodo;
	});

	it('should have a create todo function', () => {
		expect(typeof TodoController.createTodo).toBe('function');
	});

	it('should call TodoModel.create with a body', () => {
		TodoController.createTodo(req, res, next);
		expect(TodoModel.create).toBeCalledWith(newTodo);
	});

	it('should return 201', async () => {
		await TodoController.createTodo(req, res, next);
		expect(res.statusCode).toBe(201);
		expect(res._isEndCalled()).toBeTruthy();
	});

	it('should return json body in respose', async () => {
		// Mock Return value simutaes the return that our TodoModel.create (mongoDB) will send
		TodoModel.create.mockReturnValue(newTodo);
		await TodoController.createTodo(req, res, next);
		expect(res._getJSONData()).toStrictEqual(newTodo);
	});

	it('should handle errors', async () => {
		//  Promise rejection
		const errorMessage = { message: 'Done property missing' };
		const rejectedPromise = Promise.reject(errorMessage);
		TodoModel.create.mockReturnValue(rejectedPromise);
		await TodoController.createTodo(req, res, next);
		expect(next).toBeCalledWith(errorMessage);
	});
});

describe('TodoController.deleteTodo', () => {
	test('should have a delete todo function', () => {
		expect(typeof TodoController.deleteTodo).toBe('function');
	});

	test('should call find by id and delete', async () => {
		req.params.todoId = 'lmao';
		await TodoController.deleteTodo(req, res, next);
		expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(
			expect.any(String),
		);
	});

	test('should send 200 status code and deleted JSON', async () => {
		TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
		await TodoController.deleteTodo(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(newTodo);
	});

	test('should handle errors', async () => {
		const errorMessage = { message: 'Error deleting!' };
		const rejectPromise = Promise.reject(errorMessage);
		TodoModel.findByIdAndDelete.mockReturnValue(rejectPromise);
		await TodoController.deleteTodo(req, res, next);
		expect(next).toBeCalledWith(errorMessage);
	});

	test('should handle 404', async () => {
		TodoModel.findByIdAndDelete.mockReturnValue(null);
		await TodoController.deleteTodo(req, res, next);
		expect(res.statusCode).toBe(404);
		expect(res._isEndCalled).toBeTruthy();
	});
});

describe('TodoController.getTodoById', () => {
	it('should have a getToDoById method', () => {
		expect(typeof TodoController.getTodoById).toBe('function');
	});

	it('should call findById with a param', async () => {
		req.params.todoId = 'lmao';
		await TodoController.getTodoById(req, res, next);
		expect(TodoModel.findById).toBeCalledWith(expect.any(String));
	});

	it('should return json body and 200 response code', async () => {
		TodoModel.findById.mockReturnValue(newTodo);
		await TodoController.getTodoById(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual(newTodo);
		expect(res._isEndCalled()).toBeTruthy();
	});
	it('should havdle errors', async () => {
		const errorMessage = { message: 'Error finding by ID!' };
		const rejectedPromise = Promise.reject(errorMessage);
		TodoModel.findById.mockReturnValue(rejectedPromise);
		await TodoController.getTodoById(req, res, next);
		expect(next).toBeCalledWith(errorMessage);
	});

	it('should return 404 when item does not exist', async () => {
		TodoModel.findById.mockReturnValue(null);
		await TodoController.getTodoById(req, res, next);
		expect(res.statusCode).toBe(404);
		expect(res._isEndCalled()).toBeTruthy();
	});
});

describe('TodoController.getTodo', () => {
	it('should be a function', () => {
		expect(typeof TodoController.getTodos).toBe('function');
	});

	it('should call TodoModel.find({})', async () => {
		await TodoController.getTodos(req, res, next);
		expect(TodoModel.find).toHaveBeenCalledWith({});
	});

	it('should return status 200', async () => {
		await TodoController.getTodos(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled).toBeTruthy();
	});

	it('should return all the documents as json docs', async () => {
		TodoModel.find.mockReturnValue(allTodos);
		await TodoController.getTodos(req, res, next);
		expect(res._getJSONData()).toStrictEqual(allTodos);
	});
	it('should havdle errors', async () => {
		const errorMessage = { message: 'Error finding!' };
		const rejectedPromise = Promise.reject(errorMessage);
		TodoModel.find.mockReturnValue(rejectedPromise);
		await TodoController.getTodos(req, res, next);
		expect(next).toBeCalledWith(errorMessage);
	});
});

describe('TodoController.updateTodo', () => {
	it('should have a update todo function', () => {
		expect(typeof TodoController.updateTodo).toBe('function');
	});

	it('should call findByIdAndUpdate() with right args', async () => {
		req.params.todoId = 'lmao';
		req.body = newTodo;
		await TodoController.updateTodo(req, res, next);
		expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(
			expect.any(String),
			newTodo,
			{
				new: true,
				useFindAndModify: false,
			},
		);
	});

	it('should return the response with data and Status Code 200', async () => {
		TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
		await TodoController.updateTodo(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(newTodo);
	});

	it('should handle errors', async () => {
		const errorMessage = { message: 'Couldnt update!' };
		const promiseRejection = Promise.reject(errorMessage);
		TodoModel.findByIdAndUpdate.mockReturnValue(promiseRejection);
		await TodoController.updateTodo(req, res, next);
		expect(next).toBeCalledWith(errorMessage);
	});

	it('should handle 404', async () => {
		TodoModel.findByIdAndUpdate.mockReturnValue(null);
		await TodoController.updateTodo(req, res, next);
		expect(res.statusCode).toBe(404);
		expect(res._isEndCalled).toBeTruthy();
	});
});
