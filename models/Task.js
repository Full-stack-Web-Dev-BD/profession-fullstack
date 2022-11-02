const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
	details: {
		type: String,
		require: true
	},
	expireTime: {
		type: Number,
		require: true
	},
	users: {
		type: Array,
		default: []
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Task = mongoose.model('task', taskSchema);