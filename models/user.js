/**
 * User model definition
 * Represents a registered user with a unique username and email.
 * The password is hashed before saving.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, required: [true, 'Username is required'], unique: true},
    email: { type: String, required: [true, 'Email is required'], unique: true},
    password: { type: String, required: [true, 'Password is required']}
});


/**
 * Hash the password before saving to the database.
 */
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

/**
 * Compare an incoming plain text password with the hashed one.
 * @param {string} candidatePassword - Plain text password to compare.
 * @returns {Promise<boolean>} True if passwords match, else false.
 */
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
  
module.exports = mongoose.model('User', UserSchema);