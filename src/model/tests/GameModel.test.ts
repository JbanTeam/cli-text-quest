import { GameModel } from '../GameModel';

describe('GameModel', () => {
  let gameModel: GameModel;

  beforeEach(() => {
    gameModel = new GameModel();
  });

  describe('getState', () => {
    it('should return the initial state', () => {
      const state = gameModel.getState();
      expect(state).toEqual({
        steps: ['welcome'],
        actions: [],
        isGameOver: false,
      });
    });
  });

  describe('resetState', () => {
    it('should reset the state to initial', () => {
      gameModel.getState().steps.push('step1');
      gameModel.getState().actions.push('action1');
      gameModel.getState().isGameOver = true;

      gameModel.resetState();

      const state = gameModel.getState();
      expect(state).toEqual({
        steps: ['welcome'],
        actions: [],
        isGameOver: false,
      });
    });
  });

  describe('processScenario', () => {
    it('should return the initial scenario if no input is provided', () => {
      const scenarios = {
        welcome: {
          choices: ['begin'],
          description: 'Hello!',
          question: 'Ready?',
        },
      };

      const mappedScenarios = {
        begin: 'begin',
      };

      const result = gameModel.processScenario(scenarios, mappedScenarios);
      expect(result).toEqual({
        choices: ['begin'],
        description: 'Hello!',
        question: 'Ready?',
      });
    });

    it('should process a valid input and return the next scenario', () => {
      const scenarios = {
        welcome: {
          choices: ['begin'],
          description: 'Hello!',
          question: 'Ready?',
        },
        begin: {
          choices: ['nextStep'],
          description: 'Next level.',
          question: 'What do you want?',
        },
      };

      const mappedScenarios = {
        begin: 'begin',
        nextStep: 'nextStep',
        back: 'back',
      };

      const result = gameModel.processScenario(scenarios, mappedScenarios, 'begin');
      expect(result).toEqual({
        choices: ['nextStep'],
        description: 'Next level.',
        question: 'What do you want?',
      });

      const state = gameModel.getState();
      expect(state.steps).toEqual(['welcome', 'begin']);
    });

    it('should handle the "back" command correctly', () => {
      const scenarios = {
        welcome: {
          choices: ['begin'],
          description: 'Hello!',
          question: 'Ready?',
        },
        begin: {
          choices: ['nextStep'],
          description: 'Next level.',
          question: 'What do you want?',
        },
      };

      const mappedScenarios = {
        begin: 'begin',
        nextStep: 'nextStep',
        back: 'back',
      };

      gameModel.processScenario(scenarios, mappedScenarios, 'begin');

      const result = gameModel.processScenario(scenarios, mappedScenarios, 'back');
      expect(result).toEqual({
        choices: ['begin'],
        description: 'Hello!',
        question: 'Ready?',
      });

      const state = gameModel.getState();
      expect(state.steps).toEqual(['welcome']);
    });
  });

  describe('processAction', () => {
    it('should process an action and return the result', () => {
      const scenario = {
        choices: ['option1', 'option2'],
        description: 'Two options.',
        question: 'Which one?',
        actions: [
          {
            match: 'option1',
            description: 'You choose option1',
            choices: ['begin'],
          },
        ],
      };

      const newStep = 'begin';
      const isActionNextScenario = true;

      gameModel.getState().actions.push('option1');

      const result = gameModel['processAction'](scenario, newStep, isActionNextScenario);
      expect(result).toEqual({
        choices: ['begin'],
        description: 'You choose option1',
        question: '',
      });

      const state = gameModel.getState();
      expect(state.steps).toEqual(['welcome', 'begin']);
      expect(state.actions).toEqual([]);
    });
  });
});
