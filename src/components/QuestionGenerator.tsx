import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Loader2 } from "lucide-react";
import api from "@/services/api";

interface Question {
  text: string;
  field: string;
  difficulty: number;
  sampleAnswer: string;
}

interface QuestionGeneratorProps {
  onQuestionGenerated: (question: Question | null) => void;
}

const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({
    onQuestionGenerated,
  }) => {
    const [field, setField] = useState("");
    const [difficulty, setDifficulty] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [question, setQuestion] = useState<string | null>(null);
    const [isGenerated, setIsGenerated] = useState(false);
  
    const handleGenerate = async () => {
      setLoading(true);
      setError(null);
      setQuestion(null);
      try {
        const response = await api.post<Question>("/generateQuestion", {
          field,
          difficulty,
        });
        onQuestionGenerated(response.data); // Notify parent
        setQuestion(response.data.text);
        setIsGenerated(true);
      } catch (error) {
        console.error("Error fetching question:", error);
        setError("Failed to generate question. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    const handleNewQuestion = () => {
      setIsGenerated(false);
      setField("");
      setDifficulty(5);
      setQuestion(null);
      setError(null);
      onQuestionGenerated(null); // Notify parent to reset the question in Home
    };
  
    return (
      <Card>
        <CardHeader>
          {!isGenerated ? (
            <>
              <CardTitle>Generate a Question</CardTitle>
              <CardDescription>
                Specify a field and difficulty to generate a custom question.
              </CardDescription>
            </>
          ) : (
            <div className="space-y-2">
              <h3 className="text-md font-bold">
                {field}
                {` `}Question{` `}
                <span className="text-sm font-light">
                  Difficulty: {difficulty}
                </span>
              </h3>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!isGenerated && (
            <>
              <div className="space-y-2">
                <label htmlFor="field" className="text-sm font-medium">
                  Field of Interest
                </label>
                <Input
                  id="field"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  placeholder="Enter a field (e.g. React, JavaScript)"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="difficulty" className="text-sm font-medium">
                  Difficulty Level: {difficulty}
                </label>
                <Slider
                  id="difficulty"
                  min={1}
                  max={10}
                  step={1}
                  value={[difficulty]}
                  onValueChange={(value) => setDifficulty(value[0])}
                />
              </div>
            </>
          )}
          {question && (
            <div className="w-full p-4 bg-secondary rounded-md">
              <p>{question}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          {!isGenerated ? (
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Generating...
                </>
              ) : (
                "Generate Question"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNewQuestion}
              className="w-full flex items-center justify-center"
              variant={"outline"}
            >
              New Question
            </Button>
          )}
          {error && (
            <p className="text-red-500 mt-2" role="alert" aria-live="assertive">
              {error}
            </p>
          )}
        </CardFooter>
      </Card>
    );
  };
  
    export default QuestionGenerator;