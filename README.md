An AI-powered restaurant ordering app where users can order food through natural conversation. Built as part of "The Intelligent Bistro" challenge.

## Demo

Type something like:
- "I want 2 spicy burgers and a large coke"
- "Remove the coke and add a chocolate milkshake"
- "What do you have?"
- "Surprise me!"

The AI understands your intent and updates the cart automatically.

## Tech Stack

### Backend
- **Node.js + Express** — REST API
- **LangChain** — AI orchestration framework with structured output parsing
- **Groq (LLaMA 3.3 70B)** — LLM for natural language understanding
- **Zod** — Schema validation ensuring type-safe AI responses

### Frontend
- **React Native (Expo SDK 55)** — Cross-platform mobile app
- **Expo Router** — File-based navigation
- **NativeWind (Tailwind CSS)** — Utility-first styling
- **React Context API** — Global cart state management
- **Dark Mode**

## Key Features

### Conversational Ordering
Natural language input is parsed into structured cart actions via LangChain's structured output with Zod schema validation. The AI handles:
- Adding/removing items
- Modifying quantities and variants
- Suggesting alternatives for unavailable items
- Maintaining conversation context across messages

### Smart Defaults
- No size specified → defaults to "Regular"
- No variant specified → defaults to first option (Classic, Grilled, Vanilla)
- Prices calculated server-side for accuracy

### Dual Input Methods
Users can order through:
1. **Chat** — Natural language conversation with AI
2. **Menu UI** — Browse, search, filter, and tap to add with variant/size selection

### Shared Cart State
Cart is synchronized across all screens using React Context. Items added via chat appear in the cart screen and update menu quantity indicators in real-time.

## Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (Xcode) or Android Emulator or Expo Go app

### Backend
```bash
cd backend
npm install
# Create .env file with your Groq API key
echo "GROQ_API_KEY=your_key_here" > .env
node server.js
```

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npx expo start
```
Press `i` for iOS simulator or scan QR code with Expo Go.

## AI Design Decisions

- **LangChain over raw API calls** — Structured output parsing with Zod ensures the AI always returns valid, typed JSON. No manual JSON.parse needed.
- **Conversation history** — Full chat history is sent with each request so the AI maintains context (e.g., "yes" after a suggestion works correctly).
- **Server-side price calculation** — `totalPrice = price × quantity` is computed in code, not by the AI, ensuring mathematical accuracy.
- **Schema validation** — Zod schema acts as a contract between the AI and the frontend, preventing malformed responses from breaking the UI.
