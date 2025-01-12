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

type ScenariosType = Record<string, ScenarioType>;

type MappedScenariosType = Record<string, string>;

type StateType = {
  steps: string[];
  actions: string[];
  isGameOver: boolean;
};

export { ScenarioType, ActionType, ScenariosType, MappedScenariosType, StateType };
