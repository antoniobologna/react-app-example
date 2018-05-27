import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	org: { type: String, index: true },
	private: { type: Boolean, required: true, default: false },
	done: { type: Boolean, required: true, default: false },
  body: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
}, {
	toObject: { virtuals: true },
	toJSON: { virtuals: true },
});

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;
