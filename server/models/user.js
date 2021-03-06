const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			require: true,
			maxlength: 32,
		},
		email: {
			type: String,
			trim: true,
			require: true,
			unique: 32,
		},
		hashed_password: {
			type: String,
			require: true,
		},
		about: {
			type: String,
			trim: true,
		},
		salt: String,
		role: {
			type: Number,
			default: 0,
		},
		history: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

//virtual field
userSchema
	.virtual("password")
	.get(() => this._password)
	.set(function (password) {
		this._password = password;
		this.salt = uuidv4();
		this.hashed_password = this.encryptPassword(password);
	});

userSchema.method({
	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},
	encryptPassword: function (password) {
		if (!password) return "";
		try {
			return crypto
				.createHmac("sha1", this.salt)
				.update(password)
				.digest("hex");
		} catch (err) {
			return "";
		}
	},
});

module.exports = mongoose.model("User", userSchema);
