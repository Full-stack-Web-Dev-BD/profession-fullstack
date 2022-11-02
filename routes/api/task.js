const express = require('express');
const Task = require('../../models/Task');

const TaskRouter = express.Router();

TaskRouter.post('/', (req, res) => {
	if (!req.body.details || !req.body.expireTime) {
		return res.json({ message: "Please enter task details and Time " }).status(400)
	} else {
		const newTask = new Task({
			details: req.body.details,
			expireTime: req.body.expireTime,
			perticipant: {}
		})
		newTask.save()
			.then(task => {
				res.json(task).status(200)
			})
			.catch(err => {
				res.json(err).status(4000)
			})
	}
})
TaskRouter.get('/', (req, res) => {
	Task.find()
		.then(tasks => {
			res.json(tasks).status(200)
		})
		.catch(err => {
			res.json(err).status(400)
		})
})
TaskRouter.delete('/:id', (req, res) => {
	Task.findByIdAndDelete(req.params.id)
		.then(tasks => {
			res.json(tasks).status(200)
		})
		.catch(err => {
			res.json(err).status(400)
		})
})

TaskRouter.get('/:id', (req, res) => {
	Task.findById(req.params.id)
		.then(task => {
			console.log(task)
			res.json(task).status(200)
		})
		.catch(err => {
			res.json(err).status(400)
		})
})
TaskRouter.post('/perticipate', (req, res) => {
	console.log(req.body)
	Task.findById(req.body.id)
		.then(task => {
			if (task) {
				if (task?.users?.indexOf(req.body.uid) !== -1) {
					res.json({ message: "You already  Perticipated !" })
				} else {
					task.users = [...task.users, req.body.uid]
					task.save()
						.then(updated => {
							console.log(updated)
							res.json(updated)
						})
				}
			} else {
				res.json({ message: 'Task not finded' }).status(404)
			}
		})
		.catch(err => {
			console.log(err)
		})
})

module.exports = TaskRouter;