// Import dependencies 
const mongoose = require('mongoose');

// Establish MongoDB connection with env URI || default URI
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sahilDB',{
    
});


const db = mongoose.connection;

// Event listener for MongoDB connection error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Event listener for MongoDB connection success
db.once('open', function() {
  console.log('Connected to MongoDB');
});

module.exports = db;