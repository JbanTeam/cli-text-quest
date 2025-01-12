import { GameModel } from '../model/GameModel';
import { GameView } from '../view/GameView';
import { MappedScenariosType, ScenariosType } from '../types';

export class GameController {
  private model: GameModel;
  private view: GameView;

  constructor() {
    this.model = new GameModel();
    this.view = new GameView();
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
    const input = await this.view.checkUserInput(question, choices);

    if (this.model.getState().isGameOver) {
      this.view.displayMessage('Конец игры.');
      const retryInput = await this.view.checkUserInput('\nПопробовать еще раз?', ['Начать заново', 'Выход']);

      if (retryInput.toLowerCase() === 'начать заново') {
        this.model.resetState();
        return this.start(scenarios, mappedScenarios);
      } else {
        this.view.closeProcess();
        return;
      }
    } else if (input.toLowerCase() === 'выход') {
      this.view.closeProcess();
      return;
    } else {
      const { description, question, choices } = this.model.processScenario(scenarios, mappedScenarios, input.trim());
      this.view.displayMessage(description);
      return this.play(scenarios, mappedScenarios, question, choices);
    }
  }
}
