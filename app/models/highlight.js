import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const highlightSchema = new Schema({
	title: {
		type: String,
		required: [ true, 'Title is required' ]
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	isActive: {
		type: Boolean,
		default: false
	},
	images: [
		{
			imageId: {
				type: Schema.Types.ObjectId,
				ref: 'category'
			},
			imageLink: {
				type: String
			}
		}
	],
	createdAt: {
		type: Date,
		default: new Date()
	}
});

const Highlight = mongoose.model('highlight', highlightSchema);
export default Highlight;
