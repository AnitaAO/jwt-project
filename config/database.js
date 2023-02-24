const mongoose = require('mongoose');
const { MONGO_URL } = process.env;

exports.connect = () => {
    mongoose.connect(MONGO_URL, 
    {
    }).then(() => {
        console.log('Successfully connected to database')
    }).catch((error) => {
        console.log('Database connection failed. exiting now...')
        console.log(error);
        // process.exit(1);
    })
};