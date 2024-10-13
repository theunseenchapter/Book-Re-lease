const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load environment variables
const dbName = "bookstore";
const url = `mongodb+srv://oscar:I6TUsF3dLRLBkZ8P@oscar.rvxt1.mongodb.net/${dbName}?retryWrites=true&w=majority`;
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