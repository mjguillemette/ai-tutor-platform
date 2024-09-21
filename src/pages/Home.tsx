import React, { useState } from "react";
import DifficultySlider from "../components/DifficultySlider";
import QuestionGenerator from "../components/QuestionGenerator";
import AnswerEvaluator from "../components/AnswerEvaluator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Question {
  text: string;
  field: string;
  difficulty: number;
  sampleAnswer: string;
}

const Home: React.FC = () => {
  const [field, setField] = useState("React engineering");
  const [difficulty, setDifficulty] = useState(5);
  const [question, setQuestion] = useState<Question | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleQuestionGenerated = (newQuestion: Question) => {
    setQuestion(newQuestion);
    setIsOpen(false); // Close the sample answer when a new question is generated
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">AI-Powered Learning Platform</h1>

      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Generate a Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-flow-row gap-2">
              <label htmlFor="field" className="block text-sm font-medium text-gray-700">
                Field of Interest:
              </label>
              <input
                id="field"
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="border p-2 w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-flow-row gap-2">
              {/* Wrap the difficulty slider with the Tooltip */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <label htmlFor="difficulty-slider" className="block text-sm font-medium text-gray-700">
                        Difficulty Level:
                      </label>
                      <DifficultySlider
                        difficulty={difficulty}
                        setDifficulty={setDifficulty}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adjust the difficulty from 1 (easy) to 10 (hard).</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <QuestionGenerator
            field={field}
            difficulty={difficulty}
            onQuestionGenerated={handleQuestionGenerated}
          />
        </CardContent>
      </Card>

      {question && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Question:</h2>
          <p className="text-gray-700">{question.text}</p>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 text-gray-700">
                {isOpen ? (
                  <>
                    Hide Sample Answer <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show Sample Answer <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-4 border rounded-md bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700">Sample Answer:</h3>
              <p className="text-gray-600">{question.sampleAnswer}</p>
            </CollapsibleContent>
          </Collapsible>

          <AnswerEvaluator question={question.text} sampleAnswer={question.sampleAnswer} />
        </div>
      )}
    </div>
  );
};

export default Home;
