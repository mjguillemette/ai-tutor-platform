import React from 'react';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

interface DifficultySliderProps {
  difficulty: number;
  setDifficulty: (value: number) => void;
}

const DifficultySlider: React.FC<DifficultySliderProps> = ({ difficulty, setDifficulty }) => (
  <div className="space-y-2">
    <Label htmlFor="difficulty">Select Difficulty: {difficulty}</Label>
    <Slider
      id="difficulty"
      min={1}
      max={10}
      step={1}
      value={[difficulty]}
      onValueChange={(value) => setDifficulty(value[0])}
    />
  </div>
);

export default DifficultySlider;
