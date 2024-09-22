import React from "react";
import ThumbsFeedback from "./ThumbsFeedback";
import { RatingDisplay } from "./RatingDisplay";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  <>
    <div className="space-y-6">
      {/* Display alert for incorrect answers */}
      {!evaluation.pass && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Incorrect Answer</AlertTitle>
          <AlertDescription>
            <p>
              The user's answer correctly identifies the basic process of the
              Central Dogma, but lacks the depth and detail of the sample
              answer. It does not explain how this process relates to the
              expression of genetic information in proteins, or the potential
              effects of mutations.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Rating displays for accuracy, depth, and clarity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RatingDisplay category="Accuracy" {...evaluation.accuracy} />
        <RatingDisplay category="Depth" {...evaluation.depth} />
        <RatingDisplay category="Clarity" {...evaluation.clarity} />
      </div>

      {/* Thumbs Feedback */}
      <div className="mt-4">
        <ThumbsFeedback />
      </div>
    </div>
  </>
);

export default Feedback;
