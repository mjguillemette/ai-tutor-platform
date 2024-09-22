import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import api from "@/services/api";
import Feedback from "./Feedback";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CardTitle } from "./ui/card";

interface AnswerEvaluatorProps {
  question: string;
  sampleAnswer: string;
}

interface EvaluationCategory {
  rating: number;
  description: string;
}

interface EvaluationResponse {
  pass: boolean;
  explanation: string;
  accuracy: EvaluationCategory;
  depth: EvaluationCategory;
  clarity: EvaluationCategory;
  improvement_suggestions?: string[];
}

const AnswerEvaluator: React.FC<AnswerEvaluatorProps> = ({
  question,
  sampleAnswer,
}) => {
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAnswer = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/evaluateAnswer", {
        question,
        answer,
        sampleAnswer,
      });
      setEvaluation(response.data);
    } catch (error) {
      console.error("Error evaluating answer:", error);
      setError("Failed to evaluate answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <CardTitle>Response</CardTitle>
      {!evaluation && (
        <>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer here..."
            className="w-full p-2 border rounded-md"
          />
          <Button
            onClick={submitAnswer}
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? "Evaluating..." : "Submit Answer"}
          </Button>
        </>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {evaluation && (
        <>
          <CardTitle>Your Answer</CardTitle>
          <div className="p-4 bg-secondary rounded-md">
            <p>{answer}</p>
          </div>
          <Feedback evaluation={evaluation} />
        </>
      )}
    </>
  );
};

export default AnswerEvaluator;
