import BaseController from './base.controller';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const stripe = require('stripe')('sk_test_nxJqnIMdYpm8n6fVQvxGFeGU00FWevmEYX');
import { sendResetPassEmail } from '../lib/util';

class UsersController extends BaseController {
	whitelist = [
		'firstName',
		'lastName',
		'email',
		'password',
		'phoneNumber',
		'profilePic',
		'role',
		'plan',
		'amount',
		'duration',
		'stripeToken'
	];

	register = async (req, res, next) => {
		const {
			firstName,
			lastName,
			email,
			password,
			phoneNumber,
			profilePic,
			role,
			plan,
			amount,
			duration,
			stripeToken
		} = req.body;
		const amountVal = amount * 100;
		try {
			// See if user exist
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({ msg: 'User Already Exists' });
			}

			const customer = await stripe.customers.create({
				email: email,
				source: stripeToken
			});
			console.log('customer : ', customer);

			const charge = await stripe.charges.create({
				amount: amountVal,
				description: 'Sample Charge',
				currency: 'usd',
				customer: customer.id,
				receipt_email: email
			});
			console.log('charge : ', charge);
			if (!charge) {
				return res.status(400).json({ msg: 'Card Declined!' });
			}
			user = new User({
				firstName,
				lastName,
				email,
				password,
				phoneNumber,
				profilePic,
				role,
				subscription: [
					{
						plan: plan,
						amount: amount,
						duration: duration
					}
				],
				paymentMethod: [
					{
						type: 'card',
						token: charge.id
					}
				]
			});
			// Encrypt password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();
			// Return jsonwebtoken

			const payload = {
				user: {
					id: user.id,
					email: user.email,
					role: user.role
				}
			};
			jwt.sign(payload, 'i-am-the-secret-key-of-mgs-project', { expiresIn: '1h' }, (err, token) => {
				if (err) throw err;
				res.status(200).json({ token: token });
			});
		} catch (err) {
			err.status = 400;
			next(err);
		}
	};

	login = async (req, res, next) => {
		const { email, password } = req.body;

		try {
			// See if user exist
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({ msg: 'Invalid Credentials' });
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ msg: 'Invalid Credentials' });
			}

			// Return jsonwebtoken
			const payload = {
				user: {
					id: user.id,
					email: user.email,
					role: user.role
				}
			};
			jwt.sign(payload, 'i-am-the-secret-key-of-mgs-project', { expiresIn: '1h' }, (err, token) => {
				if (err) throw err;
				res.status(200).json({ token });
			});
		} catch (error) {
			err.status = 400;
			next(err);
		}
	};

	sendForgetPassEmail = async (req, res, next) => {
		const { email } = req.body;
		try {
			const user = await User.findOne({ email: email }).select('firstName lastName email');
			if (!user) {
				return res.status(404).json({ msg: 'User not Found!' });
			}
			const payload = { id: user._id };
			const token = jwt.sign(payload, 'i-am-the-secret-key-of-mgs-project', {
				expiresIn: '2m' // 2 minutes
			});
			const link = `http://localhost:3000/reset/${user._id}/${token}`;
			await sendResetPassEmail(user, link);
			return res.status(200).json({ msg: 'Email Sent!' });
		} catch (err) {
			err.status = 400;
			next(err);
		}
	};

	forgetPassword = async (req, res, next) => {
		const { password } = req.body;
		try {
			const user = await User.findOne({ _id: req.params.userId }).select('password');
			if (!user) {
				return res.status(404).json({ msg: 'User not Found!' });
			}
			const decode = jwt.verify(req.params.token, 'i-am-the-secret-key-of-mgs-project');
			if (!decode) {
				return res.status(400).json({ msg: 'Link Expired,Please Generate Again' });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();

			return res.status(200).json({ msg: 'Password Changed Successfully!' });
		} catch (err) {
			if (err.message === 'jwt expired') {
				return res.status(400).json({ msg: 'Link Expired,Please Generate Again' });
			}
			err.status = 400;
			next(err);
		}
	};

	resetPassword = async (req, res, next) => {
		const { oldPassword, newPassword } = req.body;

		try {
			const user = await User.findById({ _id: req.user.id });
			if (!user) {
				return res.status(400).json({ msg: 'User Not Found!' });
			}
			const isMatch = await bcrypt.compare(oldPassword, user.password);
			if (isMatch) {
				const salt = await bcrypt.genSalt(10);
				const updateUserPassword = await User.findByIdAndUpdate(
					req.user.id,
					{
						$set: {
							password: await bcrypt.hash(newPassword, salt)
						}
					},
					{ new: true }
				);
				return res.status(200).json({ msg: 'Password Changed Successfully!' });
			}
			return res.status(400).json({ msg: 'Invalid Password' });
		} catch (err) {
			err.status = 400;
			next(err);
		}
	};
}

export default new UsersController();
