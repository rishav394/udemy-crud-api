const mongoose = require('mongoose');

async function connect() {
	try {
		await mongoose.connect('mongodb://127.0.0.1:27017/udemy', {
			useNewUrlParser: true,
		});
	} catch (error) {
		console.error(error);
		console.log('Could not connect');
	}
}

module.exports = { connect };
