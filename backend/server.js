import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.js";


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use(chatRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "TeleOrder server is running!" });
});

app.listen(port, () => {
  console.log(`TeleOrder server running on http://localhost:${port}`);
});