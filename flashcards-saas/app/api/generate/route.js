import { NextResponse } from 'next/server';
const Groq = require('groq-sdk');

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
  const apiKey = process.env.LLAMA_API_KEY;
  const groq = new Groq({ apiKey });
  const data = await req.text();

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: data },
    ],
    model: 'llama3-8b-8192',
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stream: true, // stream enabled
    stop: null,
  });

  let accumulatedContent = '';

  try {
    for await (const chunk of completion.iterator()) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        accumulatedContent += delta; // Accumulate the content from each chunk
      }
    }

    const jsonMatch = accumulatedContent.match(/{[\s\S]*}/);

    if (jsonMatch) {
      const jsonResponse = JSON.parse(jsonMatch[0]);
      if (jsonResponse && jsonResponse.flashcards) {
        return NextResponse.json(jsonResponse.flashcards);
      } else {
        throw new Error('Invalid response format from the API');
      }
    } else {
      throw new Error('No valid JSON found in response');
    }
  } catch (error) {
    console.error('Error processing stream:', error);
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
  }
}