# "Таинственный лес" — Текстовый квест

Добро пожаловать в невероятно захватывающий текстовый квест "Таинственный лес"!
Это интерактивная текстовая игра, где ваши решения определяют ход событий и ведут к одному из множества возможных исходов.  
Погрузитесь в атмосферу загадочного леса, разгадайте его тайны и узнайте, куда приведёт ваш выбор!

---

## Функциональность

- **Нелинейный сюжет**: каждая развилка предлагает вам несколько вариантов действий, влияющих на историю.
- **Интерактивность**: игра ведётся в консоли, и вы принимаете решения в каждом сценарии.
- **Атмосфера**: детализированные описания и загадочный антураж создают увлекательный опыт.

---

## Структура сценариев

Сценарии хранятся в файле src/constants/scenarios.ts и имеют следующую структуру:

```typescript
type ScenarioType = {
  description: string; // Описание текущей ситуации/локации
  question: string; // Вопрос или призыв к действию
  choices: string[]; // Доступные варианты выбора
  actions?: ActionType[]; // Опциональные специфические действия
};

type ActionType = {
  description: string; // Результат выбора
  match: string; // Текст выбора, который активирует это действие
  isGameOver?: boolean; // Флаг завершения игры (true, если выбор ведет к концу)
  nextScenario?: boolean; // Флаг перехода к следующему сценарию (если есть продолжение)
  choices?: string[]; // Дополнительные варианты выбора (выход из действия к сценарию)
};
```

Пример заполнения сценария:

```typescript
const myNewScenario: ScenarioType = {
  description: `
Здесь вы можете написать подробное описание текущей ситуации.`,
  question: 'Что вы будете делать в этой ситуации?',
  choices: ['Вариант 1', 'Вариант 2', 'Вернуться назад'],
  actions: [
    {
      description: `
Подробное описание того, что происходит при выборе этого варианта.`,
      match: 'Вариант 1', // Должен точно соответствовать тексту из choices
      isGameOver: true, // Если выбор ведет к завершению игры
      nextScenario: true, // Если нужно перейти к другому сценарию
    },
    {
      description: 'Другое возможное развитие событий',
      match: 'Вариант 2',
      // Можно добавить новые варианты выбора для этого действия
      choices: ['Новый выбор 1', 'Новый выбор 2', 'Назад'],
    },
  ],
};
```

Добавьте новый сценарий в src/constants/constants.ts

```typescript
export const scenarios: ScenariosType = {
  [ScenarioKey.WELCOME]: welcomeScenario,
  [ScenarioKey.BEGIN]: beginScenario,
  [ScenarioKey.RIGHT]: rightDirectionScenario,
  [ScenarioKey.LEFT]: leftDirectionScenario,
  [ScenarioKey.KNOCK_THE_DOOR]: knockDoorScenario,
  [ScenarioKey.TALK_WITH_WOMAN]: talkWithWomanScenario,
};

// value - вариант из choices, lowerCased
const scenarioChoices: Record<ScenarioKey, string> = {
  [ScenarioKey.WELCOME]: 'добро пожаловать',
  [ScenarioKey.BEGIN]: 'начать',
  [ScenarioKey.RIGHT]: 'направо',
  [ScenarioKey.LEFT]: 'налево',
  [ScenarioKey.KNOCK_THE_DOOR]: 'постучать в дверь',
  [ScenarioKey.TALK_WITH_WOMAN]: 'поговорить с женщиной',
  [Scenario.VARIANT1]: 'вариант1',
};
```

src/types/enums.ts

```typescript
export enum ScenarioKey {
  WELCOME = 'welcome',
  BEGIN = 'begin',
  RIGHT = 'right',
  LEFT = 'left',
  KNOCK_THE_DOOR = 'knockTheDoor',
  TALK_WITH_WOMAN = 'talkWithWoman',
  VARIANT1 = 'variant1',
}
```

## Установка и запуск

### Требования

Для запуска игры потребуется:

- **Node.js** версии 14 и выше.

### Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/JbanTeam/cli-text-quest.git
```

2. Перейдите в папку проекта:

```bash
cd cli-text-quest
```

3. Установите зависимости:

```bash
npm install
```

### Команды

1. Запуск игры

```bash
npm run start
```

2. Запуск в режиме разработки с использованием nodemon

```bash
npm run dev
```

3. Сборка проекта:

```bash
npm run build
```

4. Запуск тестов:

```bash
npm run test
```
