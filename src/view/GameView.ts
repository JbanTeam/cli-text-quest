import readline from 'readline';

export class GameView {
  private isFirstRender = true;
  private choiceIndex = 0;
  private currentChoices: string[] = [];
  private currentResolve: ((value: string) => void) | null = null;
  private colors = [
    '\x1b[31m', // Красный
    '\x1b[32m', // Зелёный
    '\x1b[33m', // Жёлтый
    '\x1b[34m', // Синий
    '\x1b[35m', // Пурпурный
    '\x1b[36m', // Голубой
  ];

  constructor() {
    this.initReadline();
  }

  public displayMessage(result: string): void {
    console.log(result);
  }

  private initReadline() {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
    }
    process.stdin.on('keypress', this.handleKeyPress);
  }

  private colorize = (text: string, colorCode: string): string => {
    return `${colorCode}${text}\x1b[0m`;
  };

  private renderChoices = (question: string = ''): void => {
    if (!this.isFirstRender) {
      for (let i = 0; i < this.currentChoices.length; i++) {
        process.stdout.write('\x1b[1A');
        process.stdout.write('\x1b[2K');
      }
    } else {
      if (question) console.log(this.colorize(question, this.colors[this.colors.length - 1]));
      this.isFirstRender = false;
    }

    this.currentChoices.forEach((choice, i) => {
      const color = this.colors[i % this.colors.length];
      const coloredChoice = this.colorize(choice, color);
      if (i === this.choiceIndex) {
        console.log(`> ${coloredChoice}`);
      } else {
        console.log(`  ${coloredChoice}`);
      }
    });
  };

  private handleKeyPress = (str: string, key: readline.Key): void => {
    if (!this.currentResolve || !this.currentChoices.length) {
      return;
    }

    if (key.name === 'up') {
      this.choiceIndex = (this.choiceIndex - 1 + this.currentChoices.length) % this.currentChoices.length;
      this.renderChoices();
    } else if (key.name === 'down') {
      this.choiceIndex = (this.choiceIndex + 1) % this.currentChoices.length;
      this.renderChoices();
    } else if (key.name === 'return') {
      const selectedChoice = this.currentChoices[this.choiceIndex];
      this.currentResolve(selectedChoice);
      this.resetState();
    } else if (key.name === 'c' && key.ctrl) {
      this.closeProcess();
    }
  };

  public checkUserInput(question: string, choices: string[]): Promise<string> {
    return new Promise(resolve => {
      if (!choices.length) {
        return resolve('');
      }

      this.currentChoices = choices;
      this.currentResolve = resolve;

      this.choiceIndex = 0;
      this.isFirstRender = true;

      this.renderChoices(question);
    });
  }

  private resetState(): void {
    this.currentChoices = [];
    this.currentResolve = null;
    this.choiceIndex = 0;
    this.isFirstRender = true;
  }

  public closeProcess() {
    if (process.stdin.isTTY && process.stdin.setRawMode) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
    process.stdin.off('keypress', this.handleKeyPress);
    process.exit(0);
  }
}
