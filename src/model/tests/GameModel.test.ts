import { GameModel } from '../GameModel';
import { ScenarioType } from '../../types/types';
import { ScenarioKey } from '../../types/enums';

describe('GameModel', () => {
  let gameModel: GameModel;

  beforeEach(() => {
    gameModel = new GameModel();
  });

  describe('getState', () => {
    it('should return the initial state', () => {
      const state = gameModel.getState();
      expect(state).toEqual({
        steps: [ScenarioKey.WELCOME],
        actions: [],
        isGameOver: false,
      });
    });
  });

  describe('resetState', () => {
    it('should reset the state to initial', () => {
      gameModel['state'] = {
        steps: [ScenarioKey.BEGIN],
        actions: ['action1'],
        isGameOver: true,
      };

      gameModel.resetState();

      const state = gameModel.getState();
      expect(state).toEqual({
        steps: [ScenarioKey.WELCOME],
        actions: [],
        isGameOver: false,
      });
    });
  });

  describe('processScenario', () => {
    it('should return the initial scenario if no input is provided', () => {
      const result = gameModel.processScenario();
      expect(result.choices).toContain('Начать');
      expect(result.description).toContain('Добро пожаловать в невероятно захватывающий текстовый квест');
      expect(result.question).toBe('Выберите "Начать" чтобы погрузиться в приключение.');
    });

    it('should process a valid input and return the next scenario', () => {
      const input = 'Начать';
      const result = gameModel.processScenario(input.toLowerCase());

      expect(result.choices).toContain('Направо');
      expect(result.choices).toContain('Налево');
      expect(result.choices).toContain('Вернуться назад');
      expect(result.description).toContain('Вы просыпаетесь в центре густого леса, окруженного туманом.');
      expect(result.question).toBe('Куда направитесь?');

      const state = gameModel.getState();
      expect(state.steps).toEqual([ScenarioKey.WELCOME, ScenarioKey.BEGIN]);
    });

    it('should handle "back" command correctly', () => {
      const input = 'Начать';
      const inputBack = 'Вернуться назад';
      gameModel.processScenario(input.toLowerCase());

      const result = gameModel.processScenario(inputBack.toLowerCase());

      expect(result.choices).toContain('Начать');
      expect(result.description).toContain('Добро пожаловать в невероятно захватывающий текстовый квест');
      expect(result.question).toBe('Выберите "Начать" чтобы погрузиться в приключение.');

      const state = gameModel.getState();
      expect(state.steps).toEqual([ScenarioKey.WELCOME]);
    });
  });

  describe('processAction', () => {
    it('should process an action and return the result', () => {
      const input = 'Опция1';
      const scenarioInput: ScenarioType = {
        choices: ['Опция1', 'Опция2'],
        description: 'Что же выбрать, хм.',
        question: 'Так что?',
        actions: [
          {
            match: 'Опция1',
            description: 'Вы выбрали опцию1',
            choices: ['Начать'],
          },
        ],
      };

      gameModel.getState().actions.push(input.toLowerCase());

      const result = gameModel['processAction'](scenarioInput);
      expect(result).toEqual({
        choices: ['Начать'],
        description: 'Вы выбрали опцию1',
        question: '',
      });

      const state = gameModel.getState();

      expect(state.steps).toEqual([ScenarioKey.WELCOME]);
      expect(state.actions).toEqual([input.toLowerCase()]);
      expect(state.isGameOver).toBe(false);
    });
  });
});
