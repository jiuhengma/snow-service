const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义集合模型
const UserSchema = new Schema({
    username: String,
    password: String,
    instrod: {
        type: String,
        required: false
    },

}, { versionKey: false });

// 创建集合模型
const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
