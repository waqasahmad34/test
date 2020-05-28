import path from 'path';
import merge from 'lodash/merge';

// Default configuations applied to all environments
const defaultConfig = {
	env: process.env.NODE_ENV,
	get envs() {
		return {
			test: process.env.NODE_ENV === 'test',
			development: process.env.NODE_ENV === 'development',
			production: process.env.NODE_ENV === 'production'
		};
	},

	version: require('../../package.json').version,
	root: path.normalize(__dirname + '/../../..'),
	port: process.env.PORT || 5000,
	ip: process.env.IP || '0.0.0.0',
	apiPrefix: '', // Could be /api/resource or /api/v2/resource
	userRoles: [ 'photographer', 'admin' ],

	/**
   * MongoDB configuration options
   */
	mongo: {
		seed: true,
		options: {
			db: {
				safe: true
			}
		}
	},

	/**
   * Security configuation options regarding sessions, authentication and hashing
   */
	security: {
		sessionSecret: process.env.SESSION_SECRET || 'i-am-the-secret-key-of-beautiqe-project',
		sessionExpiration: process.env.SESSION_EXPIRATION || '1h', // 1 hour
		saltRounds: process.env.SALT_ROUNDS || 12
	},

	/**
   * Api Response messages
   */
	messages: {
		userNotFound: 'User Not Found!',
		userRemoved: 'User Removed Successfully!',
		userPasswordSuccess: 'Password Set Successfully!',
		userPasswordChangeSuccess: 'Password Change Successfully!',
		userInvalidPassword: 'Invalid Password!',
		userInvalidCredentials: 'Invalid Credentials!',
		linkExpire: 'Link Expired,Please Generate Again!',
		userExist: 'User Already Exist!',
		userCardDeclined: 'Card Declined!',
		emailSuccess: 'Email Sent!',
		addMemberLimit: 'You Don Not have Limit To Add Member!',
		batterySettingRange: 'Battery Setting Range Must Be 1 To 5',
		planNotFound: 'Plans Not Found!',
		planUpdate: 'Plan Updated Successfully!',
		planRemoved: 'Plan Removed Successfully!',
		planRestriction: 'You Only Create Three Plans!',
		success: 'success',
		email: 'myguardiansixtesting@gmail.com',
		password: 'myguardiansix6',
		addMemberEmailSubject: 'Set Member Account Password',
		resetPasswordEmailSubject: 'Link To Reset Password',
		historyNotFound: 'History Not Found!',
		conversationNotFound: 'Conversation Not Found!',
		chatNotFound: 'Chat Not Found!',
		eventNotFound: 'Event Not Found!',
		settingsNotFound: 'Settings Not Found!',
		invalidEventType: 'Invalid Event Type!',
		stripeSceretKey: 'sk_test_nxJqnIMdYpm8n6fVQvxGFeGU00FWevmEYX',
		s3AccessKeyId: 'AKIARHHKSX2XQBEMXMZD',
		s3SecretAccessKey: 'acceZdtzq5ody36jtjSbaY2gywaitdBzP007fnHSssKeyId',
		s3Region: 'us-west-2',
		paypalMode: 'sandbox',
		paypalClientId: 'Ads_PX1qhMjgBBOvBcz-zBQ24GB_qrZm6xS4FWvS0NEjwUY07IAGbO5FotIl4m75OoR6jJjIpn97WjFj',
		paypalClientSecret: 'EPswChI9g19ivu_EQFj5VbOspxZZ8yE4KhwnfkVAXaDCNqakYLhtdG22j6jx3w-wZByLNXkdXbTDceGk',
		dataSecret: 'data-secret-key-is-here-euy26eviy923',
		developmentLink: 'http://localhost:3000',
		productionLink: 'http://localhost:3000'
	}
};

// Environment specific overrides
const environmentConfigs = {
	development: {
		mongo: {
			uri: process.env.MONGO_URI || 'mongodb://localhost:27017/beautiqe_db'
		},
		security: {
			saltRounds: 4
		}
	},
	test: {
		port: 27017,
		mongo: {
			uri: process.env.MONGO_URI || 'mongodb://localhost:27017/beautiqe_db'
		},
		security: {
			saltRounds: 4
		}
	},
	production: {
		mongo: {
			seed: false,
			uri: process.env.MONGO_URI || 'mongodb://localhost:27017/beautiqe_db'
		}
	}
};

// Recursively merge configurations
export default merge(defaultConfig, environmentConfigs[process.env.NODE_ENV] || {});
