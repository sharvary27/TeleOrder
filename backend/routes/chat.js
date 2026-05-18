import { Router } from "express";
import { processOrder } from "../services/aiService.js";

const router = Router();

router.post("/api/chat", async (req, res) => {
  const { message, cart, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const result = await processOrder(message, cart, history);
    res.json({ response: result });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ error: "Failed to process your order" });
  }
});

export default router;