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

app.get("/", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    res.status(400).json({ error: "Query parameter 'q' is required." });
    return;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const result = await chat.sendMessage(query);
  console.log(result);
  const response = await result.response;
  const text = response.text();

  chatHistory.push({ role: "user", parts: query });
  chatHistory.push({ role: "model", parts: text });

  res.json({ response: chatHistory });
});

app.post("/", async (req, res) => {
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
