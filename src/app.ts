import { GameController } from './controller/GameController';

const game = new GameController();
game.start().catch(console.error);
