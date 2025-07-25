const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const Goal = require("./models/goal");

const app = express();

// Create logs directory if not exists
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Access log stream
const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), {
  flags: "a",
});

// Middleware
app.use(cors());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json());

// Routes
app.get("/goals", async (req, res) => {
  console.log("TRYING TO FETCH GOALS");
  try {
    const goals = await Goal.find();
    res.status(200).json({
      goals: goals.map((goal) => ({
        id: goal.id,
        text: goal.text,
      })),
    });
    console.log("FETCHED GOALS");
  } catch (err) {
    console.error("ERROR FETCHING GOALS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to load goals." });
  }
});

app.post("/goals", async (req, res) => {
  console.log("TRYING TO STORE GOAL");
  const goalText = req.body.text;

  if (!goalText || goalText.trim().length === 0) {
    console.log("INVALID INPUT - NO TEXT");
    return res.status(422).json({ message: "Invalid goal text." });
  }

  const goal = new Goal({ text: goalText });

  try {
    await goal.save();
    res
      .status(201)
      .json({ message: "Goal saved", goal: { id: goal.id, text: goalText } });
    console.log("STORED NEW GOAL");
  } catch (err) {
    console.error("ERROR SAVING GOAL");
    console.error(err.message);
    res.status(500).json({ message: "Failed to save goal." });
  }
});

app.delete("/goals/:id", async (req, res) => {
  console.log("TRYING TO DELETE GOAL");
  try {
    await Goal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Deleted goal!" });
    console.log("DELETED GOAL");
  } catch (err) {
    console.error("ERROR DELETING GOAL");
    console.error(err.message);
    res.status(500).json({ message: "Failed to delete goal." });
  }
});

// Get Mongo URI from environment
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error("FAILED TO CONNECT TO MONGODB");
      console.error(err);
    } else {
      console.log("CONNECTED TO MONGODB");
      app.listen(8000, () => {
        console.log("Server running on http://localhost:8000");
      });
    }
  }
);
