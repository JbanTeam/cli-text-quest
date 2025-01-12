import { ActionType, MappedScenariosType, StateType, ScenariosType, ScenarioType } from '../types';
import { lastElemOfArr } from '../utils';

export class GameModel {
  private state: StateType;

  constructor() {
    this.state = {
      steps: ['welcome'],
      actions: [],
      isGameOver: false,
    };
  }

  public getState() {
    return this.state;
  }

  public resetState() {
    this.state = {
      steps: ['welcome'],
      actions: [],
      isGameOver: false,
    };
  }

  private result(choices: string[], description: string, question: string) {
    return {
      choices,
      description,
      question,
    };
  }

  private processAction(scenario: ScenarioType, newStep: string, isActionNextScenario: boolean) {
    if (newStep === 'backFromAction') this.getState().actions.pop();

    if (!this.getState().actions.length) {
      return {
        choices: scenario.choices || [],
        description: scenario.description || '',
        question: scenario.question || '',
      };
    }

    const lastActionInState = lastElemOfArr(this.getState().actions);
    const action = scenario.actions?.find((action: ActionType) => action.match.includes(lastActionInState));
    const description = action?.description || '';
    const choices = action?.choices || [];
    const question = '';
    this.getState().isGameOver = action?.isGameOver || false;

    if (isActionNextScenario) {
      this.getState().steps.push(newStep);
      this.getState().actions.length = 0;
    }

    return { choices, description, question };
  }

  public processScenario(scenarios: ScenariosType, mappedScenarios: MappedScenariosType, input?: string) {
    const lastStepIndex = this.getState().steps.length - 1;
    const lastStep = this.getState().steps[lastStepIndex];

    if (!input) {
      const { choices, description, question } = scenarios[lastStep];
      return this.result(choices || [], description || '', question || '');
    }

    let scenario: ScenariosType[string];
    const hasMatchingAction = scenarios[lastStep].actions?.some((action: ActionType) => action.match.includes(input));
    const hasNextScenario = mappedScenarios[input.toLowerCase()] !== undefined;
    const actionIsNextScenario = Boolean(hasMatchingAction) && hasNextScenario;
    const newStep = mappedScenarios[input.toLowerCase()];
    if (newStep === 'back') {
      const preLastStep = this.getState().steps[lastStepIndex - 1];
      scenario = scenarios[preLastStep];
      this.getState().steps.splice(lastStepIndex, 1);
    } else if (newStep !== undefined && newStep !== 'backFromAction' && !actionIsNextScenario) {
      this.getState().steps.push(newStep);
      scenario = scenarios[newStep];
    } else {
      scenario = scenarios[lastStep];
      if (newStep !== 'backFromAction') this.getState().actions.push(input);
    }

    if (!this.getState().actions.length) {
      const { choices, description, question } = scenario;
      return this.result(choices || [], description || '', question || '');
    }

    const { choices, description, question } = this.processAction(scenario, newStep, actionIsNextScenario);
    return this.result(choices, description, question);
  }
}
