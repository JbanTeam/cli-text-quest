import { GameModel } from '../model/GameModel';
import { GameView } from '../view/GameView';
import { gameOverMsg, mappedEndGameChoices, tryAgainScreen, END_GAME_TRY_AGAIN, END_GAME_EXIT } from '../constants';
import { MappedScenariosType, ScenariosType } from '../types';

export class GameController {
  private model: GameModel;
  private view: GameView;

  constructor(model?: GameModel, view?: GameView) {
    this.model = model || new GameModel();
    this.view = view || new GameView();
  }

  public async start(scenarios: ScenariosType, mappedScenarios: MappedScenariosType): Promise<void> {
    const { description, question, choices } = this.model.processScenario(scenarios, mappedScenarios);
    this.view.displayMessage(description);

    await this.play(scenarios, mappedScenarios, question, choices);
  }

  private async play(
    scenarios: ScenariosType,
    mappedScenarios: MappedScenariosType,
    question: string,
    choices: string[],
  ): Promise<void> {
    const input = (await this.view.checkUserInput(question, choices)).toLowerCase();

    if (this.model.getState().isGameOver) {
      this.view.displayMessage(gameOverMsg);
      const { question, choices } = tryAgainScreen;
      const retryInput = (await this.view.checkUserInput(question, choices)).toLowerCase();

      if (mappedEndGameChoices[retryInput] === END_GAME_TRY_AGAIN) {
        this.model.resetState();
        return this.start(scenarios, mappedScenarios);
      } else {
        this.view.closeProcess();
        return;
      }
    } else if (mappedEndGameChoices[input] === END_GAME_EXIT) {
      this.view.closeProcess();
      return;
    } else {
      const { description, question, choices } = this.model.processScenario(scenarios, mappedScenarios, input.trim());
      this.view.displayMessage(description);
      return this.play(scenarios, mappedScenarios, question, choices);
    }
  }
}
