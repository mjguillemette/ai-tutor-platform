import React, { useState } from 'react';
import { Button } from './ui/button';
import api from '../services/api';

interface ThumbsFeedbackProps {
  questionId?: string;
}

const ThumbsFeedback: React.FC<ThumbsFeedbackProps> = ({ questionId }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = async (isPositive: boolean) => {
    try {
      await api.post('/submitFeedback', { questionId, isPositive });
      setFeedbackGiven(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (feedbackGiven) {
    return <p>Thank you for your feedback!</p>;
  }

  return (
    <div className="flex items-center space-x-2">
      <p>Was this question and feedback helpful?</p>
      <Button onClick={() => handleFeedback(true)}>👍</Button>
      <Button onClick={() => handleFeedback(false)}>👎</Button>
    </div>
  );
};

export default ThumbsFeedback;
