const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义集合模型
const ArticleSchema = new Schema({
    images: [String],
    title: String,
    author: String,
    content: String,
    // tags: Array,
    createdAt: { type: Number, default: Date.now },
}, { versionKey: false });

// 创建集合模型
const ArticleModel = mongoose.model('Article', ArticleSchema);

module.exports = ArticleModel;