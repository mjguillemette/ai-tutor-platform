import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

interface EvaluationCategory {
  rating: number;
  description: string;
}

interface EvaluationResponse {
  pass: boolean;
  explanation?: string;
  accuracy: EvaluationCategory;
  depth: EvaluationCategory;
  clarity: EvaluationCategory;
  improvement_suggestions?: string[];
}

export default async function evaluateAnswer(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send(`Method ${req.method} Not Allowed`);
    return;
  }

  const { question, answer, sampleAnswer } = req.body;

  try {
    const model = 'gpt-4';

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that evaluates answers to questions. Provide your response in JSON format.'
          },
          {
            role: 'user',
            content: `Evaluate the following answer to the given question:
            Question: ${question}
            User's Answer: ${answer}
            Sample Answer: ${sampleAnswer}
            
            Respond with a JSON object containing:
            1. "pass": boolean indicating if the answer is satisfactory
            2. "explanation": string explaining the evaluation (always include this)
            3. "accuracy", "depth", and "clarity": objects each containing:
               - "rating": number from 0 to 10
               - "description": brief string description
            4. "improvement_suggestions": array of strings with specific suggestions for improvement
            
            Example format:
            {
              "pass": true,
              "explanation": "The answer demonstrates a good understanding of the concept...",
              "accuracy": {"rating": 9, "description": "Very accurate, covers key points"},
              "depth": {"rating": 7, "description": "Good depth, could expand on [specific area]"},
              "clarity": {"rating": 8, "description": "Clear and concise, well-structured"},
              "improvement_suggestions": [
                "Consider elaborating on [specific point]",
                "You could strengthen your answer by including [specific example]"
              ]
            }`
          },
        ],
        max_tokens: 600,
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
    const evaluation: EvaluationResponse = JSON.parse(evaluationText);

    // Validate the response structure
    if (!isValidEvaluationResponse(evaluation)) {
      throw new Error('Invalid evaluation response structure');
    }

    res.status(200).json(evaluation);
  } catch (error: any) {
    console.error('Error evaluating answer:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
}

function isValidEvaluationResponse(obj: any): obj is EvaluationResponse {
  return (
    typeof obj === 'object' &&
    typeof obj.pass === 'boolean' &&
    typeof obj.explanation === 'string' &&
    isValidEvaluationCategory(obj.accuracy) &&
    isValidEvaluationCategory(obj.depth) &&
    isValidEvaluationCategory(obj.clarity) &&
    (obj.improvement_suggestions === undefined || Array.isArray(obj.improvement_suggestions))
  );
}

function isValidEvaluationCategory(obj: any): obj is EvaluationCategory {
  return (
    typeof obj === 'object' &&
    typeof obj.rating === 'number' &&
    obj.rating >= 0 &&
    obj.rating <= 10 &&
    typeof obj.description === 'string'
  );
}