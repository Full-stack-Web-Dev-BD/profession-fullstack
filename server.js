const http = require('http')
const express = require('express');
const socketio = require("socket.io")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const UserRoutes = require('./routes/api/users')
const morgan = require('morgan')
const cors = require('cors')
const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
	socketUsers
} = require('./utils/socketUser');
const TaskRouter = require('./routes/api/task');

const app = express();
app.use(morgan('dev'))
app.use(cors())

const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

require('./config/passport')(passport);

//DB config
const db = require('./config/keys').mongoURI;

//MongoDB connect
mongoose
	.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));


//use routes
app.use('/api/user', UserRoutes);
app.use('/api/task', TaskRouter)

// Sockets
io.on('connect', (socket) => {
	socket.on('join', ({ name, room }, callback) => {
		console.log("Socket requiest in room ", room, "Name ", name, "Socket ID is ", socket.id)
		const { error, user } = addUser({ id: socket.id, name, room });
		if (error) return callback(error);
		socket.join(user.room);
		socket.emit('message', { sms: { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`, uid: socket.id }, users: socketUsers() });
		socket.broadcast.to(user.room).emit('message', { sms: { user: 'admin', text: `${user.name} has joined!` }, users: socketUsers() });
		io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
	});
	socket.on('sendMessage', (data) => {
		const user = getUser(socket.id);
		console.log(user)
		io.to(user.room).emit('message', { user: user.name, text: data.message, uid: socket.id });
	});
	socket.on('disconnect', () => {
		const user = removeUser(socket.id);
		console.log("User Disconnected ")
		if (user) {
			io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
			io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
		}
	})
});

server.listen(port, () => {
	console.log('server is running on port: ' + port);
})
