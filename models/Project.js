const { Number } = require('mongoose');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  contactInfo: {
    type: String
  },
  mobile: {
    type: Number
  },
  description: {
    type: String
  },
  assignedEmployees: [{
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }],
  total_req_hour: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'active'
  },
  success: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Project', projectSchema);