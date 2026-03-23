var mongoose = require('mongoose');

var connectDB = function() {
  var mongoURI = process.env.MONGO_URI;

  mongoose.connect(mongoURI)
    .then(function(conn) {
      console.log('MongoDB Connected: ' + conn.connection.host);
    })
    .catch(function(error) {
      console.error('Error: ' + error.message);
      // In a real production app, you might want more robust error handling
      process.exit(1);
    });
};

module.exports = connectDB;
