const {MongoClient} = require("mongodb")

const dotenv = require("dotenv")
dotenv.config();

const client = new MongoClient(process.env.CONNECTIONSTRING , {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


async function start(){
    await client.connect();
    module.exports = client.db("BookRe-release")

    console.log("Connected")
    const app = require("./app")
    // app.listen(process.env.PORT)
}

start()