import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function submitFeedback(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send(`Method ${req.method} Not Allowed`);
    return;
  }

  const { questionId, isPositive } = req.body;

  // Log feedback for now; implement database storage later
  console.log(`Feedback for question ${questionId}: ${isPositive ? 'Positive' : 'Negative'}`);

  res.status(200).json({ message: 'Feedback submitted successfully' });
}
