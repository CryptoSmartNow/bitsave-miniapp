const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Load environment variables manually
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      const equalIndex = trimmedLine.indexOf("=");
      if (equalIndex > 0) {
        const key = trimmedLine.substring(0, equalIndex).trim();
        const value = trimmedLine.substring(equalIndex + 1).trim();
        if (key && value) {
          process.env[key] = value;
        }
      }
    }
  });
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "bitsave";

if (!uri) {
  console.error("MONGODB_URI environment variable is required");
  process.exit(1);
}

async function migrateData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("user_interactions");

    // Read existing JSON data
    const jsonPath = path.join(process.cwd(), "data", "user-interactions.json");

    if (!fs.existsSync(jsonPath)) {
      console.log("No existing JSON file found. Migration complete.");
      return;
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    if (jsonData.length === 0) {
      console.log("No data to migrate.");
      return;
    }

    // Check if data already exists in MongoDB
    const existingCount = await collection.countDocuments();

    if (existingCount > 0) {
      console.log(`MongoDB already contains ${existingCount} interactions. Skipping migration.`);
      return;
    }

    // Insert data into MongoDB
    const result = await collection.insertMany(jsonData);
    console.log(`Successfully migrated ${result.insertedCount} interactions to MongoDB`);

    // Create indexes for better performance
    await collection.createIndex({ timestamp: -1 });
    await collection.createIndex({ type: 1 });
    await collection.createIndex({ walletAddress: 1 });

    console.log("Created database indexes");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.close();
  }
}

migrateData();
