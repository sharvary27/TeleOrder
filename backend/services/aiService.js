import dotenv from "dotenv";
dotenv.config();
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
  item: z.string().describe("The menu item name"),
  variant: z.string().optional().describe("Flavor variant like Classic, Spicy"),
  size: z.string().optional().describe("Size like Small, Regular, Large"),
  quantity: z.number().describe("How many"),
  price: z.number().describe("Per-item price from the menu"),
});

const responseSchema = z.object({
  reply: z.string().describe("A friendly response to the user"),
  actions: z.array(actionSchema).describe("List of cart actions to perform"),
});


const structuredLLM = llm.withStructuredOutput(responseSchema);


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
- If no variant is specified, default to the first option (e.g., "Classic" for Burger, "Grilled" for Chicken Sandwich, "Vanilla" for Milkshake).
- Use exact prices from the menu.
- For "clear" actions, empty the entire cart.
- Be friendly, brief, and fun in your replies.
- If the user asks something unrelated to ordering, politely steer them back.`,
  ],
  ["human", "{message}"],
]);


const chain = prompt.pipe(structuredLLM);


export async function processOrder(message, cart) {
  const menuString = menu
    .map(
      (item) =>
        `${item.name}: $${item.price} ${item.variants ? `(Variants: ${item.variants.join(", ")})` : ""} ${item.sizes ? `(Sizes: ${item.sizes.join(", ")})` : ""}`
    )
    .join("\n");

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