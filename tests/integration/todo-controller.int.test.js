const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock/newTodo.json');
const malformedTodo = require('../mock/malformedTodo.json');
const endpoint = '/todos/';
let lastTodo;

describe(endpoint, () => {
	it('should POST ' + endpoint, async () => {
		const response = await request(app)
			.post(endpoint)
			.send(newTodo);
		expect(response.statusCode).toBe(201);
		expect(response.body.title).toBe(newTodo.title);
		expect(response.body.done).toBe(newTodo.done);
		lastTodo = response.body;
	});

	it('should return 500 on malform data with POST ' + endpoint, async () => {
		const response = await request(app)
			.post(endpoint)
			.send(malformedTodo);
		expect(response.statusCode).toBe(500);
		expect(response.body).toStrictEqual({
			message: 'Todo validation failed: done: Path `done` is required.',
		});
	});

	it('should GET by ID ' + endpoint + ':todoId', async () => {
		const response = await request(app).get(endpoint + lastTodo._id);
		expect(response.statusCode).toBe(200);
		expect(response.body.title).toBe(lastTodo.title);
		expect(response.body.done).toBe(lastTodo.done);
	});

	it('should GET ' + endpoint, async () => {
		const response = await request(app).get(endpoint);
		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toBeTruthy;
		expect(response.body[0].title).toBeDefined();
		expect(response.body[0].done).toBeDefined();
	});

	it(
		'should 404 on GET by id doesnt exist' + endpoint + ':todoId',
		async () => {
			const response = await request(app).get(
				endpoint + '5d6e1ff0778ecb8ee40de2e9',
			);
			expect(response.statusCode).toBe(404);
		},
	);

	it('should PUT ' + endpoint, async () => {
		lastTodo.title = 'Updated data';
		const response = await request(app)
			.put(endpoint + lastTodo._id)
			.send(lastTodo);
		expect(response.statusCode).toBe(200);
		expect(response.body.title).toBe(lastTodo.title);
		expect(response.body.done).toBe(lastTodo.done);
	});

	it('should DELETE ' + endpoint + ':todoId', async () => {
		const response = await request(app).delete(endpoint + lastTodo._id);
		expect(response.statusCode).toBe(200);
		expect(response.body.title).toBe(lastTodo.title);
		expect(response.body.done).toBe(lastTodo.done);
	});

	it('should handle 404 DELETE ' + endpoint + ':todoId', async () => {
		const response = await request(app).delete(endpoint + '5d6e1ff0778ecb8ee40de2e9');
		expect(response.statusCode).toBe(404);
	});
});
