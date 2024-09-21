import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

interface Question {
  text: string;
  field: string;
  difficulty: number;
  sampleAnswer: string;
}

export default async function generateQuestion(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send(`Method ${req.method} Not Allowed`);
    return;
  }

  const { field, difficulty } = req.body;

  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 10) {
    res.status(400).json({ error: 'Difficulty must be an integer between 1 and 10' });
    return;
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that generates open-ended educational questions. Provide your response in JSON format.'
          },
          {
            role: 'user',
            content: `Generate an open-ended question in the field of ${field} with a difficulty level of ${difficulty} on a scale of 1-10. 
            
            Respond with a JSON object containing:
            1. "text": the question text
            2. "field": the subject field
            3. "difficulty": the difficulty level (integer from 1 to 10)
            4. "sampleAnswer": a brief sample answer to the question
            
            Example format:
            {
              "text": "Explain the concept of supply and demand in economics and provide a real-world example.",
              "field": "Economics",
              "difficulty": 6,
              "sampleAnswer": "Supply and demand is a fundamental economic principle that describes the relationship between the quantity of a good or service available and the desire for it among buyers. When supply increases and demand remains unchanged, it leads to lower prices. Conversely, when demand increases and supply remains unchanged, it leads to higher prices. A real-world example is the housing market: when there are more houses available (high supply) than people looking to buy (low demand), housing prices tend to decrease."
            }`
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        timeout: 15000, // 15 seconds timeout
      }
    );

    const questionData = JSON.parse(response.data.choices[0].message.content.trim());

    // Validate the response structure
    if (!isValidQuestion(questionData)) {
      throw new Error('Invalid question structure');
    }

    res.status(200).json(questionData);
  } catch (error: any) {
    console.error('Error generating question:', error.response?.data || error.message);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      } else if (!error.response) {
        res.status(503).json({ error: 'Service unavailable. Please try again later.' });
      } else {
        res.status(500).json({ error: 'Failed to generate question' });
      }
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}

function isValidQuestion(obj: any): obj is Question {
  return (
    typeof obj === 'object' &&
    typeof obj.text === 'string' &&
    typeof obj.field === 'string' &&
    Number.isInteger(obj.difficulty) &&
    obj.difficulty >= 1 &&
    obj.difficulty <= 10 &&
    typeof obj.sampleAnswer === 'string'
  );
}