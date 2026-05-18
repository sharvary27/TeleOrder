import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import menu from "../data/menu.js";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
});

const actionSchema = z.object({
  type: z.enum(["add", "remove", "update", "clear"]),
  item: z.string().nullable().optional().describe("The menu item name"),
  variant: z.string().nullable().optional().describe("Flavor variant like Classic, Spicy"),
  size: z.string().nullable().optional().describe("Size like Small, Regular, Large"),
  quantity: z.number().nullable().optional().describe("How many"),
  price: z.number().nullable().optional().describe("Per-item price from the menu"),
});

const responseSchema = z.object({
  reply: z.string().describe("A short, friendly response to the user. Never include JSON, cart data, or technical details in this field."),
  actions: z.array(actionSchema).describe("List of cart actions to perform"),
});

const structuredLLM = llm.withStructuredOutput(responseSchema);

export async function processOrder(message, cart, history = []) {
  const menuString = menu
  .map(
    (item) =>
      `${item.name}: $${item.price} ${item.variants ? `(Variants: ${item.variants.join(", ")})` : ""} ${item.sizes ? `(Sizes: ${item.sizes.join(", ")})` : ""} ${item.allergens && item.allergens.length > 0 ? `[Allergens: ${item.allergens.join(", ")}]` : "[No allergens]"}`
  )
  .join("\n");

  const chatHistory = history.map((msg) => [
    msg.role === "assistant" ? "ai" : "human",
    msg.content,
  ]);

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are TeleOrder, a friendly and fun restaurant ordering assistant.

MENU:
{menu}

CURRENT CART:
{cart}

RULES:
- Only suggest items that exist on the menu.
- If no size is specified, default to "Regular".
- If no variant is specified, default to the first option.
- Use exact prices from the menu.
- For "clear" actions, empty the entire cart.
- Your "reply" must be short, friendly, and human-like. NEVER include JSON, cart arrays, or raw data in the reply.
- If the user asks for something not on the menu, suggest a similar item from the menu.
- If the user says "yes", "sure", "ok", or confirms, add the last suggested item to the cart.
- If the user asks something unrelated to ordering, politely steer them back.
- If the user is just chatting (greetings, questions, etc.) and not ordering, return an empty actions array [].
- When adding items to the cart, mention any allergens in the item. For example: "Added a Classic Burger! ⚠️ Heads up: contains Gluten, Dairy, and Sesame."
- If the user mentions an allergy, warn them about items that contain that allergen and suggest safe alternatives.`,
    ],
    ...chatHistory,
    ["human", "{message}"],
  ]);

  const chain = prompt.pipe(structuredLLM);

  const result = await chain.invoke({
    menu: menuString,
    cart: JSON.stringify(cart || []),
    message: message,
  });

  result.actions = result.actions.map((action) => ({
    ...action,
    totalPrice: action.price * action.quantity,
  }));

  return result;
}