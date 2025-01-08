import { mappedStates } from '../constants';

export class GameModel {
  private state: string;
  public isGameOver: boolean;

  constructor() {
    this.state = 'begin';
    this.isGameOver = false;
  }

  public processInput(input: string): string {
    return '';
  }
}
