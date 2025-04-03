const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, required: [true, 'Username is required'], unique: true},
    email: { type: String, required: [true, 'Email is required'], unique: true},
    password: { type: String, required: [true, 'Password is required']}
});


// Hash password
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
  
module.exports = mongoose.model('User', UserSchema);