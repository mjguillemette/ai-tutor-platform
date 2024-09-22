import React, { useState } from "react";
import QuestionGenerator from "../components/QuestionGenerator";
import AnswerEvaluator from "../components/AnswerEvaluator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
  text: string;
  field: string;
  difficulty: number;
  sampleAnswer: string;
}

const Home: React.FC = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleQuestionGenerated = (newQuestion: Question | null) => {
    setQuestion(newQuestion);
    setIsOpen(false); // Close the sample answer when a new question is generated
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <QuestionGenerator onQuestionGenerated={handleQuestionGenerated} />
      {question && (
        <Card>
          <CardContent>
            <div className="space-y-6 mt-4">
              <AnswerEvaluator
                question={question.text}
                sampleAnswer={question.sampleAnswer}
              />
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-gray-700"
                  >
                    {isOpen ? (
                      <>
                        Hide Sample Answer{" "}
                        <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Show Sample Answer{" "}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 p-4 border rounded-md bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Sample Answer:
                  </h3>
                  <p className="text-gray-600">{question.sampleAnswer}</p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Home;
