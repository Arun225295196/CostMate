const fs = require('fs');

// Create server.js
const serverCode = `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('<h1>CostMate is running!</h1>');
});

app.listen(PORT, () => {
    console.log('CostMate server running on http://localhost:' + PORT);
});`;

fs.writeFileSync('server.js', serverCode);
console.log('✅ server.js created');

// Create database.js
const dbCode = `const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/costmate', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected: ' + conn.connection.host);
    } catch (err) {
        console.error('Database connection error:', err);
        console.log('Make sure MongoDB is running!');
        process.exit(1);
    }
};

module.exports = connectDB;`;

fs.writeFileSync('config/database.js', dbCode);
console.log('✅ config/database.js created');

console.log('✅ Setup complete! Run: npm run dev');
