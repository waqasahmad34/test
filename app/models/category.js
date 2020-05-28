import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new Schema({
	name: {
		type: String,
		trim: true,
		lowercase: true,
		required: [ true, 'Name is required' ]
	},
	location: {
		type: String
	},
	resolution: {
		type: String
	},
	size: {
		type: String
	},
	color: {
		type: String
	},
	imageLink: {
		type: String
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	type: {
		type: String,
		trim: true,
		lowercase: true,
		required: [ true, 'Type is required' ]
	},
	subtype: {
		type: String,
		trim: true,
		lowercase: true,
		required: [ true, 'Subtype is required' ]
	},
	format: {
		type: String
	},
	imageStyle: {
		type: String
	},
	isActive: {
		type: Boolean,
		default: false
	},
	extension: {
		type: String
	},
	tags: [ String ],
	createdAt: {
		type: Date,
		default: new Date()
	}
});

const Category = mongoose.model('category', categorySchema);
export default Category;
