import { MappedScenariosType, ScenariosType } from '../types/types';
import { ScenarioKey, SpecialCommand, EndGameCommand } from '../types/enums';
import {
  welcomeScenario,
  beginScenario,
  rightDirectionScenario,
  leftDirectionScenario,
  knockDoorScenario,
  talkWithWomanScenario,
} from './scenarios';

export const COMMAND_BACK = SpecialCommand.BACK;
export const COMMAND_BACK_FROM_ACTION = SpecialCommand.BACK_FROM_ACTION;
export const END_GAME_TRY_AGAIN = EndGameCommand.TRY_AGAIN;
export const END_GAME_EXIT = EndGameCommand.EXIT;

export const scenarios: ScenariosType = {
  [ScenarioKey.WELCOME]: welcomeScenario,
  [ScenarioKey.BEGIN]: beginScenario,
  [ScenarioKey.RIGHT]: rightDirectionScenario,
  [ScenarioKey.LEFT]: leftDirectionScenario,
  [ScenarioKey.KNOCK_THE_DOOR]: knockDoorScenario,
  [ScenarioKey.TALK_WITH_WOMAN]: talkWithWomanScenario,
};

export const mappedScenarios: MappedScenariosType = {
  'начать': ScenarioKey.BEGIN,
  'направо': ScenarioKey.RIGHT,
  'налево': ScenarioKey.LEFT,
  'постучать в дверь': ScenarioKey.KNOCK_THE_DOOR,
  'поговорить с женщиной': ScenarioKey.TALK_WITH_WOMAN,
};

export const mappedBackChoices: Record<string, SpecialCommand> = {
  'вернуться назад': SpecialCommand.BACK,
  'назад': SpecialCommand.BACK_FROM_ACTION,
};

export const mappedEndGameChoices: Record<string, EndGameCommand> = {
  'начать заново': EndGameCommand.TRY_AGAIN,
  'выход': EndGameCommand.EXIT,
};

export const gameOverMsg = 'Конец игры.';
export const tryAgainScreen = {
  question: '\nПопробовать еще раз?',
  choices: ['Начать заново', 'Выход'],
};
