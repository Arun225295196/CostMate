const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/costmate', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
