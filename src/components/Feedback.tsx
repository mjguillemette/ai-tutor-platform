import React from 'react';
import ThumbsFeedback from './ThumbsFeedback';

interface FeedbackProps {
  evaluation: { [key: string]: string };
}

const Feedback: React.FC<FeedbackProps> = ({ evaluation }) => (
  <div className="space-y-2">
    <h3 className="text-lg font-medium">Feedback:</h3>
    <ul className="list-disc pl-5 space-y-1">
      {Object.entries(evaluation).map(([category, rating]) => (
        <li key={category}>
          <strong>{category}:</strong> {rating}
        </li>
      ))}
    </ul>
    <ThumbsFeedback />
  </div>
);

export default Feedback;
