var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	username: { type: String, required: true, unique: true, },
	email: { type: String, required: true, unique: true, },
	hashed_password: { type: String, required: true },
	salt: { type: String, default: '' },
	tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
	resetPasswordToken: String,
  	resetPasswordExpires: Date
});

UserSchema.virtual('password')
	.set(function(password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptPassword(password);
	}).get(function() { 
		return this._password 
	});

UserSchema.methods = {
	makeSalt: function () {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	},
	encryptPassword: function (password) {
		if (!password) return '';
		try {
			return crypto
				.createHmac('sha1', this.salt)
				.update(password)
				.digest('hex');
		} catch (err) {
			return '';
		}
	},   
	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	}
};

UserSchema.statics = {
	load: function (options, cb) {
		if(!options) {
			return this.find().exec(cb);
		}
		options.select = options.select || 'name username';
		this.findOne(options.criteria)
			.select(options.select)
			.exec(cb);
	}
};

var User = mongoose.model('User', UserSchema);

module.exports = User;