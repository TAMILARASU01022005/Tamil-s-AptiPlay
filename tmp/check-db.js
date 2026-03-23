const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Manually parse .env
const envFile = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) {
      let v = value.trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.substring(1, v.length - 1);
      env[key.trim()] = v;
  }
});

const uri = env.MONGODB_URI;

async function main() {
  if (!uri) {
    console.error("MONGODB_URI not found in .env");
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    // Use the DB from the URI (aptitude1)
    const db = client.db();
    console.log("Connected to DB:", db.databaseName);
    
    console.log("--- Collection: game_scores ---");
    const scores = await db.collection('game_scores').find({}).sort({createdAt: -1}).limit(20).toArray();
    console.log(JSON.stringify(scores, null, 2));

    console.log("--- Distinct Game IDs in game_scores ---");
    const gameIds = await db.collection('game_scores').distinct('gameId');
    console.log(gameIds);

  } finally {
    await client.close();
  }
}

main().catch(console.error);
