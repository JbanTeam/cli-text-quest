type ScenarioType = {
  description: string;
  question: string;
  choices: string[];
  actions?: ActionType[];
};
type ActionType = {
  description: string;
  match: string;
  isGameOver?: boolean;
  choices?: string[];
};

import { ScenarioKey, SpecialCommand } from './enums';

type ScenariosType = Record<ScenarioKey, ScenarioType>;

type MappedScenariosType = Record<string, ScenarioKey>;

type StateType = {
  steps: string[];
  actions: string[];
  isGameOver: boolean;
};

export { ScenarioType, ActionType, ScenariosType, MappedScenariosType, StateType };
