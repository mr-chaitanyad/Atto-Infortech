const { Number } = require('mongoose');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const credSchema = new Schema({
  project_name: {
    type: String
  },
  notes: {
    type: String
  },
  updated_by: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
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

module.exports = mongoose.model('Credential', credSchema);