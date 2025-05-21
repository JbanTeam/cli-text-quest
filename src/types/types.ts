import { ScenarioKey } from './enums';

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
  toNextScenario?: boolean;
};

type ScenariosType = Record<ScenarioKey, ScenarioType>;
type ScenarioReturnType = { choices: string[]; description: string; question: string };

type MappedScenariosType = Record<string, ScenarioKey>;

type StateType = {
  steps: string[];
  actions: string[];
  isGameOver: boolean;
};

export { ScenarioType, ScenarioReturnType, ActionType, ScenariosType, MappedScenariosType, StateType };
