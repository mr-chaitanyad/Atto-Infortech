const { Number } = require('mongoose');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const assignSchema = new Schema({
  project_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Project'
  },
  employee_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  published_at: {
    type: Date,
    default: Date.now
  },
  removed: {
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

module.exports = mongoose.model('Assign', assignSchema);