import { GameView } from '../view/GameView';
import { GameModel } from '../model/GameModel';
import { EndGameCommand } from '../types/enums';
import { gameOverMsg, mappedEndGameChoices, tryAgainScreen } from '../utils/constants';

export class GameController {
  private model: GameModel;
  private view: GameView;

  constructor(model?: GameModel, view?: GameView) {
    this.model = model || new GameModel();
    this.view = view || new GameView();
  }

  public async start(): Promise<void> {
    const { description, question, choices } = this.model.processScenario();
    this.view.displayMessage(description);

    await this.play(question, choices);
  }

  private async play(question: string, choices: string[]): Promise<void> {
    const input = (await this.view.checkUserInput(question, choices)).toLowerCase().trim();

    if (this.model.getState().isGameOver) {
      this.view.displayMessage(gameOverMsg);
      const { question, choices } = tryAgainScreen;
      const retryInput = (await this.view.checkUserInput(question, choices)).toLowerCase();

      if (mappedEndGameChoices[retryInput] === EndGameCommand.TRY_AGAIN) {
        this.model.resetState();
        return this.start();
      } else {
        this.view.closeProcess();
        return;
      }
    } else if (mappedEndGameChoices[input] === EndGameCommand.EXIT) {
      this.view.closeProcess();
      return;
    } else {
      const { description, question, choices } = this.model.processScenario(input);
      this.view.displayMessage(description);
      return this.play(question, choices);
    }
  }
}
