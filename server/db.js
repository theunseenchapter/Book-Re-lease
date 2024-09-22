const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function start() {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("BookRe-release"); // Return the database instance
}

module.exports = start(); // Call start and export the promise
