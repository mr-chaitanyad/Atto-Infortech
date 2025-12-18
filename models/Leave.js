const { Number } = require('mongoose');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const leaveSchema = new Schema({
  employee_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  leave_start: {
    type: Date
  },
  leave_end: {
    type: Date
  },
  leave_start_obj: {},
  leave_end_obj: {},
  approved: {
    type: Number,
    default: 0
  },
  total_days: {
    type: Number
  },
  start_only_date: {
    type: Date
  },
  end_only_date: {
    type: Date
  },
  leave_reason: {
    type: String
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

module.exports = mongoose.model('Leave', leaveSchema);