import { lastElemOfArr } from '../utils/utils';
import { SpecialCommand, ScenarioKey } from '../types/enums';
import { mappedBackChoices, mappedScenarios, scenarios } from '../constants/constants';
import { ActionType, StateType, ScenarioType, ScenarioReturnType } from '../types/types';

export class GameModel {
  private state: StateType;

  constructor() {
    this.state = {
      steps: [ScenarioKey.WELCOME],
      actions: [],
      isGameOver: false,
    };
  }

  public getState() {
    return this.state;
  }

  public resetState() {
    this.state = {
      steps: [ScenarioKey.WELCOME],
      actions: [],
      isGameOver: false,
    };
  }

  public processScenario(input?: string): ScenarioReturnType {
    const currentStep: ScenarioKey = this.getCurrentStep();

    if (!input) {
      return this.getInitialScenarioResult(currentStep);
    }

    const nextScenario = this.processNextStep(currentStep, input);

    if (this.state.actions.length === 0) {
      const { choices, description, question } = nextScenario;
      return this.resultScenario(choices, description, question);
    }

    return this.processAction(nextScenario);
  }

  private resultScenario(choices: string[], description: string, question: string) {
    return {
      choices: choices || [],
      description: description || '',
      question: question || '',
    };
  }

  private processAction(nextScenario: ScenarioType): ScenarioReturnType {
    const lastActionInState: string = lastElemOfArr(this.state.actions);
    const matchedAction: ActionType | undefined = nextScenario.actions?.find((actionItem: ActionType) =>
      actionItem.match.toLowerCase().includes(lastActionInState),
    );

    const description: string = matchedAction?.description || '';
    const choices: string[] = matchedAction?.choices || [];
    const question: string = '';
    this.state.isGameOver = matchedAction?.isGameOver || false;

    return { choices, description, question };
  }

  private getCurrentStep(): ScenarioKey {
    return lastElemOfArr(this.state.steps);
  }

  private getInitialScenarioResult(currentStep: ScenarioKey): ScenarioReturnType {
    const { choices, description, question } = scenarios[currentStep];
    return this.resultScenario(choices, description, question);
  }

  private processNextStep(currentStep: ScenarioKey, input: string): ScenarioType {
    const newStep: ScenarioKey | undefined = mappedScenarios[input];

    const curScenario: ScenarioType = scenarios[currentStep];
    const curActions: ActionType[] | undefined = curScenario.actions;

    const isBackCommand = mappedBackChoices[input] === SpecialCommand.BACK;
    const isBackFromActionCommand = mappedBackChoices[input] === SpecialCommand.BACK_FROM_ACTION;

    const action = curActions?.find(action => action.match.toLowerCase() === input.toLowerCase());

    let nextScenario: ScenarioType;

    if (isBackCommand) {
      const prevStepIndex: number = this.state.steps.length - 2;
      if (this.state.steps.length > 1) {
        const prevStep: ScenarioKey = this.state.steps[prevStepIndex];
        nextScenario = scenarios[prevStep];
        this.state.steps.pop();
      } else {
        nextScenario = scenarios[currentStep];
      }
    } else if (isBackFromActionCommand) {
      nextScenario = scenarios[currentStep];
      this.state.actions.pop();
    } else if (action) {
      this.state.actions.push(input);
      nextScenario = scenarios[currentStep];
      if (action.toNextScenario) {
        this.state.steps.push(newStep);
        this.state.actions = [];
        nextScenario = scenarios[newStep];
      }
    } else {
      nextScenario = scenarios[newStep];
      this.state.steps.push(newStep);
    }

    return nextScenario;
  }
}
