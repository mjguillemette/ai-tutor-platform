import React, { useState } from 'react';
import { Button } from './ui/button';
import api from '@/services/api';

interface QuestionGeneratorProps {
  field: string;
  difficulty: number;
  setQuestion: (question: string) => void;
}

const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({ field, difficulty, setQuestion }) => {
  const [loading, setLoading] = useState(false);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await api.post('/generateQuestion', { field, difficulty });
      setQuestion(response.data.question);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={fetchQuestion} disabled={loading}>
      {loading ? 'Generating...' : 'Generate Question'}
    </Button>
  );
};

export default QuestionGenerator;
