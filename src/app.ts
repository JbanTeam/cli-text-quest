import { GameController } from './controller/GameController';
import { mappedScenarios, scenarios } from './constants';

const game = new GameController();
game.start(scenarios, mappedScenarios);
