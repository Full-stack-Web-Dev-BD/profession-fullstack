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
			res.json(task).status(200)
		})
		.catch(err => {
			res.json(err).status(400)
		})
})


TaskRouter.post('/perticipate', (req, res) => {
	Task.findById(req.body.id)
		.then(task => {
			if (task) {
				if (task?.users?.indexOf(req.body.uid) !== -1) {
					res.json({ message: "You already  Perticipated !" })
				} else {
					task.users = [...task.users, req.body.uid]
					task.save()
						.then(updated => {
							res.json(updated)
						})
				}
			} else {
				res.json({ message: 'Task not finded' }).status(404)
			}
		})
		.catch(err => {
			console.log(err)
			res.json({ message: "Server Error" }).status(500)
		})
})
TaskRouter.post('/reply', (req, res) => {
	Task.findById(req.body.id)
		.then(task => {
			if (task) {
				if (task.answers?.findIndex((obj) => obj.uid === req.body.uid) !== -1) {
					res.json({ message: "You already  Answered !" })
				} else {
					task.answers = [...task.answers, { uid: req.body.uid, answer: req.body.answer }]
					task.save()
						.then(updated => {
							res.json(updated)
						})
				}
			} else {
				console.log("Task Not Exist")
				res.json({ message: 'Task not finded' }).status(404)
			}
		})
		.catch(err => {
			console.log(err)
		})
})

TaskRouter.post('/feedback', (req, res) => {

	// Task.findById(req.body.id)
	// 	.then(task => {
	// 		if (task) {
	// 			var newTasks = [...task.answers,]
	// 			newTasks[2] = {
	// 				uid: newTasks[2].uid,
	// 				answer: newTasks[2].answer,
	// 				feedback: req.body.feedback
	// 			}
	// 			task.answers = [...newTasks]
	// 			task.save()
	// 				.then(updated => {
	// 					res.json(updated)
	// 				})
	// 		} else {
	// 			console.log("Task Not Exist")
	// 			res.json({ message: 'Task not finded' }).status(404)
	// 		}
	// 	})
	// 	.catch(err => {
	// 		console.log(err)
	// 	})
	// return
	Task.findById(req.body.id)
		.then(task => {
			if (task) {
				if (task.answers?.findIndex((obj) => obj.uid === req.body.uid) !== -1) {
					const myIndex = task.answers?.findIndex((obj) => obj.uid === req.body.uid)
					if (task?.answers?.length - 1 == myIndex) {
						var newAns = [...task.answers,]
						newAns[0] = {
							uid: newAns[0].uid,
							answer: newAns[0].answer,
							feedback: req.body.feedback
						}
						task.answers = [...newAns]
						task.save()
							.then(updated => {
								console.log("feedback", updated)
								res.json({ message: "Feedback submitted !!" })
							})
							.catch(err => {
								console.log(err)
							})
					} else {
						var newAns = [...task.answers,]
						newAns[myIndex + 1] = {
							uid: newAns[myIndex + 1].uid,
							answer: newAns[myIndex + 1].answer,
							feedback: req.body.feedback
						}
						task.answers = [...newAns]
						task.save()
							.then(updated => {
								console.log("feedback", updated)
								res.json({ message: "Feedback submitted !!" })
							})
							.catch(err => {
								console.log(err)
							})
					}
					// if (task?.answers?.length - 1 == myIndex) {
					// 	task.answers[0] = { ...task.answers[0], comment: req.body.feedback }
					// 	task.save()
					// 	res.json({ message: "Feedback Submitted" })
					// } else {
					// 	var newAns= [...task]
					// 	task.save()
					// 		.then(rs => {
					// 			Task.findById(req.body.id)
					// 				.then(rc => {
					// 					console.log("updated rc", rc)
					// 				})
					// 			console.log(rs, "haha")
					// 			res.json({ message: "Ha ha " })
					// 		})
					// }
				} else {
					res.json({ message: "Answer  Not Finded" })
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