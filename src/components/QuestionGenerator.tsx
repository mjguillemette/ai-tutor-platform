import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Loader2 } from "lucide-react"; // Assuming you're using Lucide for icons
import api from "@/services/api";

interface Question {
  text: string;
  field: string;
  difficulty: number;
  sampleAnswer: string;
}

interface QuestionGeneratorProps {
  field: string;
  difficulty: number;
  onQuestionGenerated: (question: Question) => void;
}

const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({
  field,
  difficulty,
  onQuestionGenerated,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Question>("/generateQuestion", {
        field,
        difficulty,
      });
      onQuestionGenerated(response.data);
    } catch (error) {
      console.error("Error fetching question:", error);
      setError("Failed to generate question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={fetchQuestion}
        disabled={loading}
        className="flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" /> Generating...
          </>
        ) : (
          "Generate Question"
        )}
      </Button>
      {error && (
        <p
          className="text-red-500 mt-2"
          role="alert"
          aria-live="assertive" /* Enhances accessibility for screen readers */
        >
          {error}
        </p>
      )}
    </>
  );
};

export default QuestionGenerator;
