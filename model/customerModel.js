const mongoose = require('mongoose');

const customer = mongoose.Schema({
  fullname: String,
  email: String,
  phone: Number,
  image: String
})

module.exports = mongoose.model('abc',customer);