const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load environment variables

const url = process.env.CONNECTIONSTRING;
const dbName = 'BookRe-release';

let db;

// Connect to MongoDB
const client = new MongoClient(url);

async function start() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');
        db = client.db(dbName);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

// Export the database instance and the start function
module.exports = {
    start,
    getDb: () => db
};
