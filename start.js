/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const logger = require('./handlers/logger');
const config = require('./config/');

// console.log(config);

// Connect to our Database and handle any bad connections
mongoose.connect(`${config.db.serverDb.uri}` , {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", async () => {
  console.log('Connection established to DB...');
  await require('./utils/adminDb').createSystemUser(config.admin)
  console.log("Server started now..");
});

mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

db.on('error', (err) => {
  console.error(`🚫 🚫 🚫 🚫 → ${err.message}`);
});

// Import all our models
require('./models/User');
require('./models/Project');
require('./models/Assign');
require('./models/Tracker');
require('./models/Leave');
require('./models/Timesheet');
require('./models/SubTask');
require('./models/Credential');

// Start our app!
const app = require('./app');
app.set('port', config.server.port || 49003);
const server = app.listen(app.get('port'), () => {
  logger.log('info', {code: 200, msg: 'Server started!'});
  console.log(`Server trying to start at port ${server.address().port}....`);
});