import readline from 'readline';

export class GameView {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  public showWelcomeMessage(msg: string): void {
    console.log(msg);
  }

  // public getUserInput(question: string, cb: (input: string) => void): void {
  //   this.rl.question(question, cb);
  // }
  public getUserInput(
    question: string,
    choices: string[],
    callback: (selected: string) => void,
  ): void {
    let index = 0;

    const renderChoices = () => {
      console.clear();
      console.log(question);
      choices.forEach((choice, i) => {
        if (i === index) {
          console.log(`> ${choice}`);
        } else {
          console.log(`  ${choice}`);
        }
      });
    };

    const onKeyPress = (key: readline.Key) => {
      if (key.name === 'up') {
        index = (index - 1 + choices.length) % choices.length;
        renderChoices();
      } else if (key.name === 'down') {
        index = (index + 1) % choices.length;
        renderChoices();
      } else if (key.name === 'return') {
        process.stdin.off('keypress', onKeyPress);
        this.rl.write('\n');
        callback(choices[index]);
      }
    };

    renderChoices();
    process.stdin.on('keypress', onKeyPress);
  }

  public displayResult(result: string): void {
    console.log(result);
  }

  public showGameOverMessage(): void {
    console.log('Конец игры.');
    this.rl.close();
  }
}
