// model 大概是用來宣告這個table內的格式
const mongoose = require('mongoose');
const { Schema } = mongoose;

// 這裡是宣告table格式
const userSchema = new Schema({
  googleId: String
})

mongoose.model('users', userSchema);