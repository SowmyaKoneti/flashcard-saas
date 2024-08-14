import { NextResponse } from "next/server";

const Groq = require('groq-sdk');
const apiKey = process.env.LLAMA_API_KEY;
const groq = new Groq({ apiKey });
async function main() {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role": "user",
        "content": `You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards. Both front and back should be one sentence long. You should return in the following JSON format: {"flashcards":[{"front": "Front of the card", "back": "Back of the card"}]}`
      }
    ],
    "model": "llama3-8b-8192",
    "temperature": 1,
    "max_tokens": 1024,
    "top_p": 1,
    "stream": true,
    "stop": null
  });

  for await (const chunk of chatCompletion) {
    responseContent += chunk.choices[0]?.delta?.content || '';
  }

  try {
    const flashcards = JSON.parse(responseContent);
    console.log('Flashcards:', flashcards);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
  }

  return NextResponse.json(flashcards.flashcards)
}

main();