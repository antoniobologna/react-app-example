import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Not a very good idea to store creds along user data info,
 * but for matters of simplicity let's just do this ;)
 */
const UserSchema = new Schema({
	email: { type: String, required: true, unique: true, index: true },
	password: { type: String, required: true },
  name: { type: String, required: true },
  admin: {type: Boolean, default: false},
	verified: {type: Boolean, default: true},
	revoked: {type: Boolean, default: false},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
