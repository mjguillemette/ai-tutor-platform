import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function evaluateAnswer(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send(`Method ${req.method} Not Allowed`);
    return;
  }

  const { question, answer } = req.body;

  try {
    const model = 'gpt-4'; // Use a cost-effective model

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: [
          {
            role: 'user',
            content: `Question: ${question}\nAnswer: ${answer}\nPlease evaluate the answer based on Accuracy, Depth, and Clarity using a scale of 1-10. Provide brief feedback for each category in the format "Category: Feedback".`,
          },
        ],
        max_tokens: 150,
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const evaluationText = response.data.choices[0].message.content.trim();

    const evaluation = parseEvaluation(evaluationText);

    res.status(200).json({ evaluation });
  } catch (error: any) {
    console.error('Error evaluating answer:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
}

function parseEvaluation(text: string): { [key: string]: string } {
  const lines = text.split('\n').filter(Boolean);
  const evaluation: { [key: string]: string } = {};

  lines.forEach((line) => {
    const [category, feedback] = line.split(':').map((str) => str.trim());
    if (category && feedback) {
      evaluation[category] = feedback;
    }
  });

  return evaluation;
}
