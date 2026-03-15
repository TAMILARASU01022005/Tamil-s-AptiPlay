const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://Aptitude-Game:q1w2e3r4@aptitude1.9n75yrp.mongodb.net/?appName=Aptitude1';

async function run() {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    try {
        console.log("Connecting...");
        await client.connect();
        console.log("Connected successfully!");
        const databasesList = await client.db().admin().listDatabases();
        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    } catch (e) {
        console.error("Connection failed:");
        console.error(e);
    } finally {
        await client.close();
    }
}

run();
