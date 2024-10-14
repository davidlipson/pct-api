// src/index.js
import express, { Express, Request, Response } from "express";
import {
  calculatePoints,
  fetchLeaderboard,
  fetchTodaysLetters,
  getLeaderboard,
} from "./helpers";
import { fetchTodaysDictionary } from "./helpers/todaysDictionary";
import { findUser, generateTables, setUsername } from "./db";
import { addWord } from "./db/addWord";
import { fetchMyWords, myWords } from "./db/myWords";
import bodyParser from "body-parser";

(async () => {
  await generateTables();
})();

const app: Express = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3005;

app.get("/today", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    let words = [];
    if (userId) {
      //words = await fetchMyWords(userId);
      words = await myWords(userId);
    }
    const data = await fetchTodaysLetters();
    res.send({ todaysLetters: data, myWords: words });
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/login", async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    res.status(400).send("Missing userId query parameter");
    return;
  }
  const foundUser = await findUser({ userId });
  if (!foundUser) {
    res.status(404).send("User not found");
    return;
  }
  res.send(foundUser);
});

app.get("/validate", async (req: Request, res: Response) => {
  try {
    const word = req.query.word as string;
    const userId = req.query.userId as string;

    if (!word) {
      res.status(400).send("Missing word query parameter");
      return;
    }

    const todaysDictionary = await fetchTodaysDictionary();
    const isValid = todaysDictionary.includes(word);

    if (isValid) {
      const points = calculatePoints(word);

      let myWords = [];
      if (userId) {
        myWords = await addWord({ word, points, userId });
      }
      res.send({ valid: true, points, myWords });
    } else {
      res.send({ valid: false });
    }
  } catch (err) {
    console.error("Error fetching today's dictionary:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/leaderboard", async (req: Request, res: Response) => {
  const data = await fetchLeaderboard();
  res.send(data);
});

app.post("/setUsername", async (req: Request, res: Response) => {
  // get body of req
  const { userId, username } = req.body;
  await setUsername({ userId, username });

  // handle failures better
  res.send("Success");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at port ${port}`);
});
