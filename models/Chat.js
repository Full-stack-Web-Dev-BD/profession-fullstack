const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	room: {
		type: String,
		require: true
	},
	user: {
		type: String,
		require: true
	},
	text: {
		type: Object,
		require: true
	},
	UID: {
		type: String,
		default: 'user'
	},
	date: {
		type: Date,
		default: Date.now
	}
}, {
	collection: "users"
})

module.exports = User = mongoose.model('users', userSchema);