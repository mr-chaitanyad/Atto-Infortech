const { Number } = require('mongoose');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  password: {
    type: String
  },
  mobile: {
    type: Number
  },
  success: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: 'active'
  },
  type: {
    type: String,
    default: 'admin'
  },
  encryptedKey: {
    type: String
  },
  role: {
    type: Number,
    default: 2 // 1===admin, 2===employee
  },
  dateRange:{
    type: String,
    default: ""
  },
  leaveAllow:{
    type: Number,
    min: 0,
    max: 99,
  },
  dob: {
    type: Date
  },
  resource_based: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);