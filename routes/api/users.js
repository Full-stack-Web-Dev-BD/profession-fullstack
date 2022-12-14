const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');

const router = express.Router();


router.post('/register', (req, res) => {

	const { errors, isValid } = validateRegisterInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				errors.email = 'Email already exits';
				res.status(400).json(errors);
			} else {

				const avatar = gravatar.url(req.body.email, {
					s: '200',
					r: 'pg',
					d: 'mm'
				})
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					avatar,
					password: req.body.password,
					userType: req.body.userType,
					passWordInText: req.body.password
				})
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser.save()
							.then((user) => {
								res.json(user);
							})
							.catch((err) => {
								console.log(err);
							})
					})
				})
			}
		})
})

router.post('/login', (req, res) => {

	const { errors, isValid } = validateLoginInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email })
		.then(user => {
			if (!user) {
				errors.email = 'User not found';
				res.status(404).json(errors);
			}
			bcrypt.compare(password, user.password)
				.then(isMatch => {
					if (isMatch) {
						const payload = { type: user.userType, id: user.id, name: user.name, avatar: user.avatar };
						jwt.sign(
							payload,
							keys.secretOrKey,
							{ expiresIn: 3600 },
							(err, token) => {
								res.json({
									success: true,
									token: 'bearer ' + token
								})
							});
					} else {
						errors.password = 'Incorrect password';
						res.status(400).json(errors);
					}
				})
		});
});

router.get('/all-user', (req, res) => {
	User.find()
		.then(allUser => {
			res.json(allUser).status(200)
		})
		.catch(err => {
			res.json(err).status(400)
		})
})

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email
	});
});

module.exports = router;