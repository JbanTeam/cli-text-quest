import { GameView } from '../GameView';

describe('GameView', () => {
  let gameView: GameView;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    gameView = new GameView();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  afterAll(() => {
    process.stdin.pause();
  });

  describe('displayMessage', () => {
    it('should display a message', () => {
      const message = 'Test message';
      gameView.displayMessage(message);
      expect(consoleSpy).toHaveBeenCalledWith(message);
    });
  });

  describe('checkUserInput', () => {
    it('should return the selected choice', async () => {
      const question = 'Choose an option:';
      const choices = ['Option 1', 'Option 2', 'Option 3'];

      setTimeout(() => {
        process.stdin.emit('keypress', '', { name: 'down' });
        process.stdin.emit('keypress', '', { name: 'return' });
      }, 100);

      const result = await gameView.checkUserInput(question, choices);
      expect(result).toBe('Option 2');
    });
  });

  describe('handleKeyPress', () => {
    it('should move selection up on "up" key', () => {
      gameView['currentChoices'] = ['Option 1', 'Option 2', 'Option 3'];
      gameView['currentResolve'] = jest.fn();
      gameView['choiceIndex'] = 1;

      gameView['handleKeyPress']('', { name: 'up' });
      expect(gameView['choiceIndex']).toBe(0);
    });

    it('should move selection down on "down" key', () => {
      gameView['currentChoices'] = ['Option 1', 'Option 2', 'Option 3'];
      gameView['currentResolve'] = jest.fn();
      gameView['choiceIndex'] = 1;

      gameView['handleKeyPress']('', { name: 'down' });
      expect(gameView['choiceIndex']).toBe(2);
    });

    it('should resolve the selected choice on "return" key', async () => {
      const choices = ['Option 1', 'Option 2', 'Option 3'];
      const question = 'Choose an option:';

      const promise = gameView.checkUserInput(question, choices);

      setTimeout(() => {
        gameView['handleKeyPress']('', { name: 'return' });
      }, 0);

      await expect(promise).resolves.toBe('Option 1');

      expect(gameView['currentResolve']).toBeNull();
      expect(gameView['currentChoices']).toEqual([]);
      expect(gameView['choiceIndex']).toBe(0);
    });
  });

  describe('renderChoices', () => {
    it('should render choices with correct formatting', () => {
      gameView['currentChoices'] = ['Option 1', 'Option 2', 'Option 3'];
      gameView['choiceIndex'] = 1;
      gameView['renderChoices']('Choose an option:');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Option 1'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Option 2'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Option 3'));
    });
  });
});
