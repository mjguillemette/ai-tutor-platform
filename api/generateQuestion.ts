import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function generateQuestion(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send(`Method ${req.method} Not Allowed`);
    return;
  }

  const { field, difficulty } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Generate a challenging question in the field of ${field} with a difficulty level of ${difficulty}.`,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const question = response.data.choices[0].message.content.trim();
    res.status(200).json({ question });
  } catch (error: any) {
    console.error('Error generating question:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate question' });
  }
}
