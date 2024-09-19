import React, { useState } from 'react';
import DifficultySlider from '../components/DifficultySlider';
import QuestionGenerator from '../components/QuestionGenerator';
import AnswerEvaluator from '../components/AnswerEvaluator';

const Home: React.FC = () => {
  const [field, setField] = useState('React engineering');
  const [difficulty, setDifficulty] = useState(5);
  const [question, setQuestion] = useState('');

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">AI-Powered Learning Platform</h1>

      <div className="space-y-2">
        <label htmlFor="field" className="block text-sm font-medium">
          Field of Interest:
        </label>
        <input
          id="field"
          type="text"
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <DifficultySlider difficulty={difficulty} setDifficulty={setDifficulty} />

      <QuestionGenerator field={field} difficulty={difficulty} setQuestion={setQuestion} />

      {question && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Question:</h2>
          <p>{question}</p>
          <AnswerEvaluator question={question} />
        </div>
      )}
    </div>
  );
};

export default Home;
