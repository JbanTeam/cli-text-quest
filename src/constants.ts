import {
  welcomeScenario,
  beginScenario,
  rightDirectionScenario,
  leftDirectionScenario,
  knockDoorScenario,
  talkWithWomanScenario,
} from './scenarios';
import { MappedScenariosType, ScenariosType } from './types';

export const COMMAND_BACK = 'back' as const;
export const COMMAND_BACK_FROM_ACTION = 'backFromAction' as const;
export const END_GAME_TRY_AGAIN = 'tryAgain' as const;
export const END_GAME_EXIT = 'exit' as const;

export const scenarios: ScenariosType = {
  welcome: welcomeScenario,
  begin: beginScenario,
  right: rightDirectionScenario,
  left: leftDirectionScenario,
  knockTheDoor: knockDoorScenario,
  talkWithWoman: talkWithWomanScenario,
};

export const mappedScenarios: MappedScenariosType = {
  'начать': 'begin',
  'направо': 'right',
  'налево': 'left',
  'постучать в дверь': 'knockTheDoor',
  'поговорить с женщиной': 'talkWithWoman',
  'вернуться назад': COMMAND_BACK,
  'назад': COMMAND_BACK_FROM_ACTION,
};

export const mappedEndGameChoices: Record<string, string> = {
  'начать заново': END_GAME_TRY_AGAIN,
  'выход': END_GAME_EXIT,
};

export const gameOverMsg = 'Конец игры.';
export const tryAgainScreen = {
  question: '\nПопробовать еще раз?',
  choices: ['Начать заново', 'Выход'],
};
