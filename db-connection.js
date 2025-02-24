const mongoose = require("mongoose");
const db = mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = db;
