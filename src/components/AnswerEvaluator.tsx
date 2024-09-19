import React, { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import api from '@/services/api';
import Feedback from './Feedback';

interface AnswerEvaluatorProps {
  question: string;
}

interface Evaluation {
  [key: string]: string;
}

const AnswerEvaluator: React.FC<AnswerEvaluatorProps> = ({ question }) => {
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);

  const submitAnswer = async () => {
    setLoading(true);
    try {
      const response = await api.post('/evaluateAnswer', { question, answer });
      setEvaluation(response.data.evaluation);
    } catch (error) {
      console.error('Error evaluating answer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter your answer here..."
      />
      <Button onClick={submitAnswer} disabled={loading}>
        {loading ? 'Evaluating...' : 'Submit Answer'}
      </Button>
      {evaluation && <Feedback evaluation={evaluation} />}
    </div>
  );
};

export default AnswerEvaluator;
