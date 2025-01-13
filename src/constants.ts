import {
  welcomeScenario,
  beginScenario,
  rightDirectionScenario,
  leftDirectionScenario,
  knockDoorScenario,
  talkWithWomanScenario,
} from './scenarios';
import { MappedScenariosType, ScenariosType } from './types';

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
  'вернуться назад': 'back',
  'назад': 'backFromAction',
};

export const mappedEndGameChoices: Record<string, string> = {
  'начать заново': 'tryAgain',
  'выход': 'exit',
};

export const gameOverMsg = 'Конец игры.';
export const tryAgainScreen = {
  question: '\nПопробовать еще раз?',
  choices: ['Начать заново', 'Выход'],
};
