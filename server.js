const express = require("express");
const cors = require('cors');

const corsOptions = {
  origin: '*',
  credentials: true,            
  optionsSuccessStatus: 200
}

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());  // Important to parse JSON body requests

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let chatHistory = [];

// GET endpoint that returns a welcome message
app.get("/", (req, res) => {
    res.send("Welcome to the world of LLM APIs");
  });

app.post("/chat", async (req, res) => {
  const { data } = req.body;
  if (!data) {
    res.status(400).json({ error: "Data is required in POST body." });
    return;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const result = await chat.sendMessage(data);
  const response = await result.response;
  const text = response.text();

  chatHistory.push({ role: "user", parts: data });
  chatHistory.push({ role: "model", parts: text });
  res.json({ response: chatHistory });
});


// POST endpoint to clear chat history
app.get("/clear-chat", (req, res) => {
    chatHistory = [];  // Clear the chat history
    res.json({ message: "Chat history cleared successfully." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
