import { GameController } from '../GameController';
import { GameModel } from '../../model/GameModel';
import { GameView } from '../../view/GameView';
import { ScenarioKey } from '../../types/enums';

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
      const spyDisplayMsg = jest.spyOn(mockView, 'displayMessage');
      const spyCheckUserInput = jest.spyOn(mockView, 'checkUserInput');
      mockModel.getState.mockReturnValue({
        steps: [ScenarioKey.WELCOME],
        actions: [],
        isGameOver: false,
      });

      mockModel.processScenario.mockReturnValue({
        choices: [ScenarioKey.BEGIN],
        description: 'Welcome!',
        question: 'How are you?',
      });

      mockView.checkUserInput.mockResolvedValue('выход');

      await gameController.start();

      expect(spyDisplayMsg).toHaveBeenCalledWith('Welcome!');

      expect(spyCheckUserInput).toHaveBeenCalledWith('How are you?', [ScenarioKey.BEGIN]);
    });
  });

  describe('play', () => {
    it('should handle user input and continue the game', async () => {
      const spyDisplayMsg = jest.spyOn(mockView, 'displayMessage');
      const spyCheckUserInput = jest.spyOn(mockView, 'checkUserInput');

      mockModel.getState.mockReturnValue({
        steps: [ScenarioKey.WELCOME],
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

      await gameController.start();

      expect(spyDisplayMsg).toHaveBeenCalledWith('Привет!');
      expect(spyDisplayMsg).toHaveBeenCalledWith('Круто!');

      expect(spyCheckUserInput).toHaveBeenCalledWith('Как дела?', ['Начать']);
      expect(spyCheckUserInput).toHaveBeenCalledWith('Как дела?', ['Дальше']);
    });

    it('should handle game over and restart the game', async () => {
      const spyDisplayMsg = jest.spyOn(mockView, 'displayMessage');
      const spyCheckUserInput = jest.spyOn(mockView, 'checkUserInput');
      const spyResetState = jest.spyOn(mockModel, 'resetState');

      mockModel.getState
        .mockReturnValueOnce({
          steps: [ScenarioKey.WELCOME],
          actions: [],
          isGameOver: true,
        })
        .mockReturnValue({
          steps: [ScenarioKey.WELCOME],
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

      await gameController.start();

      expect(spyDisplayMsg).toHaveBeenCalledWith('Конец игры.');
      expect(spyCheckUserInput).toHaveBeenCalledWith('\nПопробовать еще раз?', ['Начать заново', 'Выход']);
      expect(spyResetState).toHaveBeenCalled();
    });

    it('should handle exit command and close the process', async () => {
      const spyCloseProcess = jest.spyOn(mockView, 'closeProcess');
      mockModel.getState.mockReturnValue({
        steps: [ScenarioKey.WELCOME],
        actions: [],
        isGameOver: false,
      });

      mockModel.processScenario.mockReturnValue({
        choices: ['Начать'],
        description: 'Привет!',
        question: 'Как дела?',
      });

      mockView.checkUserInput.mockResolvedValue('выход');

      await gameController.start();

      expect(spyCloseProcess).toHaveBeenCalled();
    });
  });
});
