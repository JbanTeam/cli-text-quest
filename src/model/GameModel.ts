import { ActionType, MappedScenariosType, StateType, ScenariosType, ScenarioType } from '../types';
import { COMMAND_BACK, COMMAND_BACK_FROM_ACTION } from '../constants';
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

  private processAction(
    scenario: ScenarioType,
    newStep: string,
    isActionNextScenario: boolean,
  ): { choices: string[]; description: string; question: string } {
    if (newStep === COMMAND_BACK_FROM_ACTION) {
      this.state.actions.pop();
    }

    if (this.state.actions.length === 0) {
      return {
        choices: scenario.choices || [],
        description: scenario.description || '',
        question: scenario.question || '',
      };
    }

    const lastActionInState: string = lastElemOfArr(this.state.actions);
    const matchedAction: ActionType | undefined = scenario.actions?.find((actionItem: ActionType) =>
      actionItem.match.includes(lastActionInState),
    );

    const description: string = matchedAction?.description || '';
    const choices: string[] = matchedAction?.choices || [];
    const question: string = '';
    this.state.isGameOver = matchedAction?.isGameOver || false;

    if (isActionNextScenario) {
      this.state.steps.push(newStep);
      this.state.actions = [];
    }

    return { choices, description, question };
  }

  public processScenario(
    scenarios: ScenariosType,
    mappedScenarios: MappedScenariosType,
    input?: string,
  ): { choices: string[]; description: string; question: string } {
    const lastStepIndex: number = this.state.steps.length - 1;
    const currentStep: string = this.state.steps[lastStepIndex];

    if (!input) {
      const { choices, description, question } = scenarios[currentStep];
      return this.result(choices || [], description || '', question || '');
    }

    let nextScenario: ScenarioType;
    const lowercasedInput: string = input.toLowerCase();
    const newStepKey: string | undefined = mappedScenarios[lowercasedInput];

    const currentScenarioActions: ActionType[] | undefined = scenarios[currentStep].actions;
    const hasMatchingAction: boolean =
      currentScenarioActions?.some((action: ActionType) => action.match.includes(input)) || false;
    const hasNextScenarioMapping: boolean = newStepKey !== undefined;
    const isActionLeadingToNewScenario: boolean =
      hasMatchingAction &&
      hasNextScenarioMapping &&
      newStepKey !== COMMAND_BACK &&
      newStepKey !== COMMAND_BACK_FROM_ACTION;

    if (newStepKey === COMMAND_BACK) {
      const previousStepIndex: number = lastStepIndex - 1;
      const previousStep: string = this.state.steps[previousStepIndex];
      nextScenario = scenarios[previousStep];
      this.state.steps.pop();
    } else if (hasNextScenarioMapping && newStepKey !== COMMAND_BACK_FROM_ACTION && !isActionLeadingToNewScenario) {
      this.state.steps.push(newStepKey);
      nextScenario = scenarios[newStepKey];
    } else {
      nextScenario = scenarios[currentStep];
      if (newStepKey !== COMMAND_BACK_FROM_ACTION) {
        this.state.actions.push(input);
      }
    }

    if (this.state.actions.length === 0) {
      const { choices, description, question } = nextScenario;
      return this.result(choices || [], description || '', question || '');
    }

    const stepForActionProcessing: string = newStepKey || currentStep;
    const { choices, description, question } = this.processAction(
      nextScenario,
      stepForActionProcessing,
      isActionLeadingToNewScenario,
    );
    return this.result(choices, description, question);
  }
}
