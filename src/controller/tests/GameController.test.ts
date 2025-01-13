import { GameController } from '../GameController';
import { GameModel } from '../../model/GameModel';
import { GameView } from '../../view/GameView';

describe('GameController', () => {
  let gameController: GameController;
  let mockModel: jest.Mocked<GameModel>;
  let mockView: jest.Mocked<GameView>;

  beforeEach(() => {
    mockModel = {
      processScenario: jest.fn(),
      getState: jest.fn(),
      resetState: jest.fn(),
    } as unknown as jest.Mocked<GameModel>;

    mockView = {
      displayMessage: jest.fn(),
      checkUserInput: jest.fn(),
      closeProcess: jest.fn(),
    } as unknown as jest.Mocked<GameView>;
    gameController = new GameController(mockModel, mockView);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('start', () => {
    it('should start the game and display the initial state', async () => {
      const scenarios = {
        welcome: {
          choices: ['begin'],
          description: 'Welcome!',
          question: 'How are you?',
        },
      };

      const mappedScenarios = {
        'начать': 'begin',
      };

      mockModel.getState.mockReturnValue({
        steps: ['welcome'],
        actions: [],
        isGameOver: false,
      });

      mockModel.processScenario.mockReturnValue({
        choices: ['begin'],
        description: 'Welcome!',
        question: 'How are you?',
      });

      mockView.checkUserInput.mockResolvedValue('выход');

      await gameController.start(scenarios, mappedScenarios);

      expect(mockView.displayMessage).toHaveBeenCalledWith('Welcome!');

      expect(mockView.checkUserInput).toHaveBeenCalledWith('How are you?', ['begin']);
    });
  });

  describe('play', () => {
    it('should handle user input and continue the game', async () => {
      const scenarios = {
        welcome: {
          choices: ['Начать'],
          description: 'Привет!',
          question: 'Как дела?',
        },
        begin: {
          choices: ['Дальше'],
          description: 'Круто!',
          question: 'Как дела?',
        },
      };

      const mappedScenarios = {
        'начать': 'begin',
      };

      mockModel.getState.mockReturnValue({
        steps: ['welcome'],
        actions: [],
        isGameOver: false,
      });

      mockModel.processScenario
        .mockReturnValueOnce({
          choices: ['Начать'],
          description: 'Привет!',
          question: 'Как дела?',
        })
        .mockReturnValueOnce({
          choices: ['Дальше'],
          description: 'Круто!',
          question: 'Как дела?',
        })
        .mockReturnValueOnce({
          choices: ['Дальше'],
          description: 'Круто!',
          question: 'Как дела?',
        });

      mockView.checkUserInput
        .mockResolvedValueOnce('начать')
        .mockResolvedValueOnce('дальше')
        .mockResolvedValueOnce('выход');

      await gameController.start(scenarios, mappedScenarios);

      expect(mockView.displayMessage).toHaveBeenCalledWith('Привет!');
      expect(mockView.displayMessage).toHaveBeenCalledWith('Круто!');

      expect(mockView.checkUserInput).toHaveBeenCalledWith('Как дела?', ['Начать']);
      expect(mockView.checkUserInput).toHaveBeenCalledWith('Как дела?', ['Дальше']);
    });

    it('should handle game over and restart the game', async () => {
      const scenarios = {
        welcome: {
          choices: ['Начать'],
          description: 'Привет!',
          question: 'Как дела?',
        },
      };

      const mappedScenarios = {
        'начать': 'begin',
      };

      mockModel.getState
        .mockReturnValueOnce({
          steps: ['welcome'],
          actions: [],
          isGameOver: true,
        })
        .mockReturnValue({
          steps: ['welcome'],
          actions: [],
          isGameOver: false,
        });

      mockModel.processScenario.mockReturnValue({
        choices: ['Начать'],
        description: 'Привет!',
        question: 'Как дела?',
      });

      mockView.checkUserInput
        .mockResolvedValueOnce('начать')
        .mockResolvedValueOnce('начать заново')
        .mockResolvedValueOnce('выход');

      await gameController.start(scenarios, mappedScenarios);

      expect(mockView.displayMessage).toHaveBeenCalledWith('Конец игры.');
      expect(mockView.checkUserInput).toHaveBeenCalledWith('\nПопробовать еще раз?', ['Начать заново', 'Выход']);
      expect(mockModel.resetState).toHaveBeenCalled();
    });

    it('should handle exit command and close the process', async () => {
      const scenarios = {
        welcome: {
          choices: ['Начать'],
          description: 'Привет!',
          question: 'Как дела?',
        },
      };

      const mappedScenarios = {
        'начать': 'begin',
      };

      mockModel.getState.mockReturnValue({
        steps: ['welcome'],
        actions: [],
        isGameOver: false,
      });

      mockModel.processScenario.mockReturnValue({
        choices: ['Начать'],
        description: 'Привет!',
        question: 'Как дела?',
      });

      mockView.checkUserInput.mockResolvedValue('выход');

      await gameController.start(scenarios, mappedScenarios);

      expect(mockView.closeProcess).toHaveBeenCalled();
    });
  });
});
