const mongoose = require('mongoose');

const url = 'mongodb://totravel:ttyouji@8.137.92.100:27017/totravel';
mongoose.connect(url);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = db;
