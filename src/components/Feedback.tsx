import React from 'react';
import ThumbsFeedback from './ThumbsFeedback';
import { RatingDisplay } from './RatingDisplay';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EvaluationCategory {
  rating: number;
  description: string;
}

interface EvaluationResponse {
  pass: boolean;
  explanation?: string;
  correctAnswer?: string;
  accuracy: EvaluationCategory;
  depth: EvaluationCategory;
  clarity: EvaluationCategory;
}

interface FeedbackProps {
  evaluation: EvaluationResponse;
}

const Feedback: React.FC<FeedbackProps> = ({ evaluation }) => (
  <div className="space-y-4">
    <h3 className="text-2xl font-bold">Feedback:</h3>
    {!evaluation.pass && (
      <Alert variant="destructive">
        <AlertTitle>Incorrect Answer</AlertTitle>
        <AlertDescription>
          {evaluation.explanation}
          {evaluation.correctAnswer && (
            <><br /><strong>Correct Answer:</strong> {evaluation.correctAnswer}</>
          )}
        </AlertDescription>
      </Alert>
    )}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <RatingDisplay category="Accuracy" {...evaluation.accuracy} />
      <RatingDisplay category="Depth" {...evaluation.depth} />
      <RatingDisplay category="Clarity" {...evaluation.clarity} />
    </div>
    <ThumbsFeedback />
  </div>
);

export default Feedback;