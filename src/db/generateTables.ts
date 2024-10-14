import { client } from "./client";

/*
export const createDatabase = async () => {
  try {
    await serverClient.connect();

    // Check if the database exists
    const dbCheckResult = await serverClient.query(
      `SELECT 1 FROM pg_database WHERE datname = 'pct'`
    );

    if (dbCheckResult.rowCount === 0) {
      // Database does not exist, create it
      await serverClient.query(`CREATE DATABASE pct`);
      console.log("Database created successfully");
    } else {
      console.log("Database already exists");
    }
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await serverClient.end();
  }
};*/

export const initializeUserTable = async () => {
  // create table if not exists
  // called user
  // consists of userId (unique primary key), username
  await client.query(
    `
        CREATE TABLE IF NOT EXISTS users (
            userId VARCHAR(50) PRIMARY KEY,
            username VARCHAR(10),
            streak INT DEFAULT 0,
            lastWonDate DATE
        );`,
    (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Table created successfully");
      }
    }
  );
};

export const initializeFoundWordsTable = async () => {
  await client.query(
    `
       CREATE TABLE IF NOT EXISTS found_words (
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            word VARCHAR(25),
            userId VARCHAR(50),
            points INT,
            PRIMARY KEY (word, userId)
        ); `,
    (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Table created successfully");
      }
    }
  );
};

export const generateTables = async () => {
  //await createDatabase();
  await client.connect();
  await initializeUserTable();
  await initializeFoundWordsTable();
};
