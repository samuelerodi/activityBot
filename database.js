
const config = require('./config');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(config.mongodb.uri, { useNewUrlParser: true });
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connection.on('connected', ()=>console.log('DB connection successful!'));
