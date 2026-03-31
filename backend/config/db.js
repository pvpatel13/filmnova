var mongoose = require('mongoose');

var connectDB = function () {
  var mongoURII = process.env.MONGO_URI;

  mongoose.connect(mongoURII)
    .then(function (conn) {
      console.log('MongoDB Connected: ' + conn.connection.host);
    })
    .catch(function (error) {
      console.error('Error: ' + error.message);
      process.exit(1);
    });
};

module.exports = connectDB;
