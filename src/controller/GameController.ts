import { GameModel } from '../model/GameModel';
import { GameView } from '../view/GameView';
import { states } from '../constants';

export class GameController {
  private model: GameModel;
  private view: GameView;

  constructor() {
    this.model = new GameModel();
    this.view = new GameView();
  }

  public start(): void {
    const startMessage = states.begin.desctiption;
    this.view.showWelcomeMessage(startMessage);
    const onInput = (input: string) => {
      this.handleInput(input.trim());
      if (this.model.isGameOver) {
        this.view.showGameOverMessage();
        process.exit(0);
      } else {
        this.view.getUserInput('', [''], onInput);
      }
    };

    this.view.getUserInput('', [''], onInput);
  }

  private handleInput(input: string): void {
    const result = this.model.processInput(input);
    this.view.displayResult(result);
  }
}
