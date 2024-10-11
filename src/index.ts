// src/index.js
import express, { Express, Request, Response } from "express";
import {
  calculatePoints,
  fetchTodaysLetters,
  updateUserScore,
  getLeaderboard,
} from "./helpers";
import { fetchTodaysDictionary } from "./helpers/todaysDictionary";
import cors from "cors";

const allowedOrigins = [
  "https://pct-game-dev-c1fe8d9e3dd7.herokuapp.com",
  "http://localhost:3001",
];

const corsOptions = {
  origin: function (origin: any, callback: Function) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

const app: Express = express();
app.use(cors(corsOptions));

const port = process.env.PORT || 3005;

app.get("/today", async (_: Request, res: Response) => {
  try {
    const data = await fetchTodaysLetters();
    res.send(data);
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).send("Internal Server Error");
  }
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
      res.send({ valid: true, points });
      if (userId) {
        await updateUserScore(userId, points);
      }
    } else {
      res.send({ valid: false });
    }
  } catch (err) {
    console.error("Error fetching today's dictionary:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/leaderboard", async (req: Request, res: Response) => {
  const data = await getLeaderboard();
  res.send(data);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at port ${port}`);
});
