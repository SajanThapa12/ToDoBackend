const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://sajan:MzQaVUTjNO9EbVAa@cluster0.toiqkbi.mongodb.net/m-db?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected...');

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
module.module 
module.exports = connectDB;