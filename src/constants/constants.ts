import { ScenariosType } from '../types/types';
import { ScenarioKey, SpecialCommand, EndGameCommand } from '../types/enums';
import {
  welcomeScenario,
  beginScenario,
  rightDirectionScenario,
  leftDirectionScenario,
  knockDoorScenario,
  talkWithWomanScenario,
} from './scenarios';

const scenarioChoices: Record<ScenarioKey, string> = {
  [ScenarioKey.WELCOME]: 'добро пожаловать',
  [ScenarioKey.BEGIN]: 'начать',
  [ScenarioKey.RIGHT]: 'направо',
  [ScenarioKey.LEFT]: 'налево',
  [ScenarioKey.KNOCK_THE_DOOR]: 'постучать в дверь',
  [ScenarioKey.TALK_WITH_WOMAN]: 'поговорить с женщиной',
};

const backChoices: Record<SpecialCommand, string> = {
  [SpecialCommand.BACK]: 'вернуться назад',
  [SpecialCommand.BACK_FROM_ACTION]: 'назад',
};

const endGameChoices: Record<EndGameCommand, string> = {
  [EndGameCommand.TRY_AGAIN]: 'начать заново',
  [EndGameCommand.EXIT]: 'выход',
};

export const pressEventKeys = {
  UP: 'up',
  DOWN: 'down',
  RETURN: 'return',
  C: 'c',
};

export const scenarios: ScenariosType = {
  [ScenarioKey.WELCOME]: welcomeScenario,
  [ScenarioKey.BEGIN]: beginScenario,
  [ScenarioKey.RIGHT]: rightDirectionScenario,
  [ScenarioKey.LEFT]: leftDirectionScenario,
  [ScenarioKey.KNOCK_THE_DOOR]: knockDoorScenario,
  [ScenarioKey.TALK_WITH_WOMAN]: talkWithWomanScenario,
};

export const mappedScenarios: Record<string, ScenarioKey> = Object.fromEntries(
  Object.entries(scenarioChoices).map(([key, phrase]) => {
    return [phrase, key as ScenarioKey];
  }),
);

export const mappedBackChoices: Record<string, SpecialCommand> = Object.fromEntries(
  Object.entries(backChoices).map(([key, phrase]) => {
    return [phrase, key as SpecialCommand];
  }),
);

export const mappedEndGameChoices: Record<string, EndGameCommand> = Object.fromEntries(
  Object.entries(endGameChoices).map(([key, phrase]) => {
    return [phrase, key as EndGameCommand];
  }),
);

export const gameOverMsg = 'Конец игры.';

export const tryAgainScreen = {
  question: '\nПопробовать еще раз?',
  choices: ['Начать заново', 'Выход'],
};
