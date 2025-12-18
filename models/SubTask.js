const { Number } = require('mongoose');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const subTaskSchema = new Schema({
  project_id: {
    type: mongoose.Types.ObjectId,
    ref: "Project"
  },
  sub_task: {
    type: String
  },
  status: {
    type: String,
    default: "active"
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

module.exports = mongoose.model('SubTask', subTaskSchema);