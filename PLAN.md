# SpaceX Explorer — План реализации

> Frontend SpaceX Explorer на публичном [SpaceX API v4](https://api.spacexdata.com/v4).
> Документ-трекер для агента: отмечай `[x]` по мере выполнения. Каждый шаг — отдельная фича, валидируемая в браузере.

## Зафиксированные решения (стек)

| Параметр        | Решение                                                                    |
| --------------- | -------------------------------------------------------------------------- |
| Framework       | Next.js 16.2, **App Router**                                               |
| Язык            | TypeScript (strict, no `any` в core-логике)                                |
| Data Layer      | **TanStack React Query** (`useInfiniteQuery`, retry/backoff, staleTime)    |
| Стили           | **Tailwind CSS 4+**, светлая минималистичная тема                          |
| Рендеринг       | Всё client-side (совместимо с GitHub Pages)                                |
| Список запусков | Client-side `useInfiniteQuery` через `POST /launches/query`                |
| Detail page     | Client-side фетч по ID                                                     |
| Деплой          | **GitHub Pages** (`output: 'export'`, `basePath: /DigtAG-SpaceX-Explorer`) |
| Тесты           | Базовые (Vitest + RTL)                                                     |
| Бонус           | Графики статистики (Recharts)                                              |

## Сквозные принципы (соблюдать на КАЖДОМ шаге)

- Simplest code that solves the problem
- No abstractions until needed 3+ times
- Readable over clever
- Only what was explicitly requested
- Touch only related files
- When in doubt, ask
- [ ] 📱 **Mobile-first**: верстать сначала под мобильный, затем tablet/desktop через Tailwind breakpoints
- [ ] ✅ **Валидация каждого шага на 3 viewport**: mobile (~375px) / tablet (~768px) / desktop (~1280px)
- [ ] 🔤 **Семантика + labels сразу** при написании разметки (целенаправленный a11y-аудит — Шаг 6)
- [ ] 🚫 **No `any`** в core-логике, strict TS, именованные параметры для функций с 2+ аргументами
- [ ] 📖 **Перед любым кодом по Next.js** — читать релевантный doc в `node_modules/next/dist/docs/`

### Как работать с каждым шагом

- **Skill** — перед реализацией шага активировать указанный skill (специализированные знания/паттерны).
- **Acceptance Criteria (AC)** — формальные критерии приёмки. Шаг считается завершённым, только когда ВСЕ AC выполнены.
- **Code Review** — после реализации шага запустить отдельного агента `code-reviewer` (через Task) И прогнать skill `/code-review` по диффу. Найденные проблемы исправить до перехода к следующему шагу.

---

## Шаг 0 — Каркас + первый рабочий экран (MVP-ядро)

**Цель: `npm run dev` → в браузере реальный список запусков.**

> **Skill:** `nextjs-developer`

- [x] `create-next-app` (App Router, TS, Tailwind, ESLint)
- [x] Agent-ready docs:
  - [x] проверить/создать `AGENTS.md` с блоком `<!-- BEGIN:nextjs-agent-rules -->` … `<!-- END:nextjs-agent-rules -->`
  - [x] создать/дополнить проектный `CLAUDE.md` с директивой `@AGENTS.md`
  - [x] убедиться, что доки лежат в `node_modules/next/dist/docs/`
- [x] `next.config`: `output: 'export'`, `basePath` + `assetPrefix` = `/DigtAG-SpaceX-Explorer`, `images.unoptimized`
- [x] strict `tsconfig` по global rules, ESLint/Prettier
- [x] `QueryClientProvider` в `app/providers.tsx` + настройка `staleTime` и `refetchOnWindowFocus` (background refresh)
- [x] Типы SpaceX: `Launch`, `Rocket`, `Launchpad`, `QueryResponse<T>`
- [x] API-клиент: fetch-wrapper + `queryLaunches()`
- [x] Страница `/`: список запусков (имя, дата, патч, success-бейдж), пагинация «Load more»

**Acceptance Criteria:**

- [x] `npm run dev` стартует без ошибок, `npm run build` (export) проходит
- [x] На `/` отображается список реальных запусков из API (имя, дата, патч, success-бейдж)
- [x] «Load more» подгружает следующую страницу через `POST /launches/query` (page +1)
- [x] `tsc --noEmit` и ESLint без ошибок; в core-логике нет `any`
- [x] `AGENTS.md` + `CLAUDE.md` на месте, доки доступны в `node_modules/next/dist/docs/`
- [x] Корректное отображение на mobile (~375px) / tablet (~768px) / desktop (~1280px)

**Code Review:**

- [x] Запустить агента `code-reviewer` (Task) по диффу шага
- [x] Прогнать skill `/code-review`
- [x] Исправить замечания

## Шаг 1 — Loading / Empty / Error states + retry

> **Skill:** `frontend-developer`

- [x] Скелетоны карточек
- [x] Empty-state
- [x] Error-state с кнопкой Retry
- [x] Retry/backoff на 429/5xx в QueryClient (exponential backoff)

**Acceptance Criteria:**

- [x] Во время загрузки показываются скелетоны (не пустой экран и не layout shift)
- [x] При нулевом результате показывается осмысленный empty-state
- [x] При ошибке сети/сервера показывается error-state с кнопкой Retry, кнопка реально повторяет запрос
- [x] Retry срабатывает автоматически на 429/5xx с exponential backoff; на 4xx (кроме 429) — НЕ ретраит
- [x] Состояния не ломают вёрстку на mobile/tablet/desktop

**Code Review:**

- [x] Запустить агента `code-reviewer` (Task) по диффу шага
- [x] Прогнать skill `/code-review`
- [x] Исправить замечания

## Шаг 2 — Фильтры, сортировка, поиск (серверные, через query)

> **Skill:** `nextjs-developer` (+ `api-design-principles` для дизайна query-слоя)

- [x] Фильтры: upcoming/past, success/failure, date range
- [x] Сортировка по date/name
- [x] Поиск по mission name (`$regex` в query)
- [x] Состояние фильтров → в URL search params (shareable)
- [x] Всё уходит в `POST /launches/query` (НЕ клиентская фильтрация)
- [x] Debounce для поля поиска

**Acceptance Criteria:**

- [x] Каждый фильтр (upcoming/past, success/failure, date range) меняет тело `query` и результат корректен
- [x] Сортировка по date и по name работает в обе стороны (asc/desc)
- [x] Поиск по mission name фильтрует на сервере (`$regex`/`$options`), с debounce
- [x] Состояние фильтров/сортировки/поиска отражено в URL; перезагрузка страницы и шаринг ссылки восстанавливают состояние
- [x] Фильтрация НЕ выполняется на клиенте поверх полной выборки (проверить вкладку Network)
- [x] Сброс фильтров возвращает исходный список
- [x] Панель фильтров usable на mobile/tablet/desktop

**Code Review:**

- [x] Запустить агента `code-reviewer` (Task) по диффу шага
- [x] Прогнать skill `/code-review`
- [x] Исправить замечания

## Шаг 3 — Infinite scroll + виртуализация + мемоизация

> **Skill:** `vercel-react-best-practices` (+ `performance-engineer` для замеров)

- [ ] IntersectionObserver → автоподгрузка
- [ ] Виртуализация списка (`react-window`)
- [ ] Мемоизация карточек/селекторов
- [ ] Сохранение работы фильтров/поиска вместе с infinite scroll

**Acceptance Criteria:**

- [ ] При прокрутке к концу списка следующая страница подгружается автоматически (IntersectionObserver)
- [ ] Список виртуализирован: в DOM присутствует только видимый набор узлов (проверить в DevTools), а не все загруженные элементы
- [ ] Карточки мемоизированы — нет лишних ререндеров при подгрузке (проверить React DevTools Profiler)
- [ ] Скролл плавный (нет заметных фризов) на длинной выборке
- [ ] Фильтры/поиск/сортировка из Шага 2 продолжают работать совместно с infinite scroll
- [ ] Плавный скролл на mobile/tablet/desktop

**Code Review:**

- [ ] Запустить агента `code-reviewer` (Task) по диффу шага
- [ ] Прогнать skill `/code-review`
- [ ] Исправить замечания

## Шаг 4 — Launch Detail `/launches/[id]`

> **Skill:** `nextjs-developer`

- [ ] `generateStaticParams` → `[]` (динамика на клиенте, совместимо с export)
- [ ] Client-side фетч launch по ID
- [ ] Связанные `rocket` и `launchpad` (фетч по их ID)
- [ ] Инфо: имя, дата, success, details, links
- [ ] Галерея Flickr-изображений (если есть)
- [ ] Loading/error/empty состояния для детали и связанных сущностей

**Acceptance Criteria:**

- [ ] Переход на `/launches/[id]` с карточки списка открывает корректную деталь
- [ ] Прямой заход по URL (refresh) на `/launches/[id]` работает (export + client-side fetch)
- [ ] Отображаются name, date, success, details, links (внешние ссылки открываются корректно)
- [ ] Подгружаются и показываются связанные rocket и launchpad по их ID
- [ ] Галерея Flickr рендерится при наличии изображений; при отсутствии — корректный fallback
- [ ] Loading/error состояния присутствуют, error имеет retry
- [ ] Несуществующий ID → корректный not-found/error-state, без падения
- [ ] Деталь читаема на mobile/tablet/desktop

**Code Review:**

- [ ] Запустить агента `code-reviewer` (Task) по диффу шага
- [ ] Прогнать skill `/code-review`
- [ ] Исправить замечания

## Шаг 5 — Favorites

> **Skill:** `frontend-developer` (+ `vercel-composition-patterns` для дизайна хука/контекста)

- [ ] Хук `useFavorites` (LocalStorage, типобезопасно)
- [ ] Кнопка-закладка на карточке и в детали
- [ ] Страница `/favorites` — просмотр/удаление

**Acceptance Criteria:**

- [ ] Клик по закладке добавляет/убирает запуск из избранного; состояние кнопки отражает текущий статус
- [ ] Избранное сохраняется в LocalStorage и переживает перезагрузку страницы
- [ ] Страница `/favorites` показывает все сохранённые запуски, удаление работает и сразу обновляет UI
- [ ] Пустое избранное → корректный empty-state
- [ ] Закладка синхронизирована между списком, деталью и страницей favorites (single source of truth)
- [ ] Хук типобезопасен (no `any`), устойчив к повреждённому/отсутствующему LocalStorage
- [ ] Корректно на mobile/tablet/desktop

**Code Review:**

- [ ] Запустить агента `code-reviewer` (Task) по диффу шага
- [ ] Прогнать skill `/code-review`
- [ ] Исправить замечания

## Шаг 6 — Accessibility аудит

> **Skill:** `web-design-guidelines`

- [ ] Семантика проверена (landmarks, заголовки)
- [ ] Labels на интерактивных элементах
- [ ] Keyboard navigation по всем сценариям
- [ ] Focus management (модалки/переходы) + `focus-visible`
- [ ] ARIA где нужно
- [ ] Контраст светлой темы

**Acceptance Criteria:**

- [ ] Все интерактивные сценарии (фильтры, поиск, навигация, закладки, галерея) доступны только с клавиатуры
- [ ] Видимый focus-ring (`focus-visible`) на всех фокусируемых элементах
- [ ] Корректная семантика: landmarks (`header`/`main`/`nav`), иерархия заголовков, списки
- [ ] Все контролы имеют доступные имена (label/aria-label); изображения — осмысленный alt
- [ ] Динамические состояния (loading/error) озвучиваются (`aria-live` где уместно)
- [ ] Контраст текста соответствует WCAG 2.1 AA
- [ ] Прогон через axe/Lighthouse без критических нарушений a11y

**Code Review:**

- [ ] Запустить агента `code-reviewer` (Task) по диффу шага
- [ ] Прогнать skill `/code-review`
- [ ] Исправить замечания

## Шаг 7 — Bonus: Графики статистики

> **Skill:** `frontend-developer`

- [ ] Recharts: запуски по годам
- [ ] Recharts: success rate
- [ ] Страница `/stats`
- [ ] Loading/empty/error состояния для агрегации

**Acceptance Criteria:**

- [ ] На `/stats` отображаются два графика: запуски по годам и success rate
- [ ] Графики построены на реальных данных API, цифры сходятся с выборкой
- [ ] Есть loading-состояние и осмысленный empty/error-state
- [ ] Графики responsive и читаемы на mobile/tablet/desktop
- [ ] Графики доступны (заголовки/подписи осей, не только цвет как носитель смысла)

**Code Review:**

- [ ] Запустить агента `code-reviewer` (Task) по диффу шага
- [ ] Прогнать skill `/code-review`
- [ ] Исправить замечания

## Шаг 8 — Тесты (Vitest + RTL)

> **Skill:** `tdd` (+ `react-vite-best-practices` для конфигурации Vitest)

- [ ] Настройка Vitest + React Testing Library
- [ ] Юнит-тест: построение query-параметров (фильтры/сортировка/поиск → тело query)
- [ ] Юнит-тест: `useFavorites` (add/remove/persist/повреждённый storage)
- [ ] Юнит-тест: логика фильтров

**Acceptance Criteria:**

- [ ] `npm test` проходит полностью (зелёный), без флака
- [ ] Покрыты: query-билдер, `useFavorites`, логика фильтров
- [ ] Тесты проверяют поведение (а не реализацию), читаемы
- [ ] Скрипт `test` добавлен в `package.json`; тесты можно запускать в CI

**Code Review:**

- [ ] Запустить агента `code-reviewer` (Task) по диффу шага
- [ ] Прогнать skill `/code-review`
- [ ] Исправить замечания

## Шаг 9 — Деплой GitHub Pages + README

> **Skill:** `github-actions-creator`

- [ ] `.nojekyll`
- [ ] GitHub Action: build → export → deploy на `gh-pages`
- [ ] README:
  - [ ] How to run
  - [ ] Architecture decisions (App vs Pages Router — обоснование)
  - [ ] Data layer (почему React Query)
  - [ ] SpaceX API usage (queries, pagination strategy)
  - [ ] Performance considerations (virtualization, memoization, background refresh)
  - [ ] Accessibility considerations
  - [ ] Tradeoffs / what next
  - [ ] Known limitations / TODOs (сравнение запусков, offline/SW, SSR — осознанно отложены)

**Acceptance Criteria:**

- [ ] GitHub Action собирает и деплоит на `gh-pages` без ошибок
- [ ] Живая ссылка GitHub Pages открывается, все роуты работают (включая прямой заход на `/launches/[id]` и `/favorites`, `/stats`)
- [ ] Ассеты/изображения грузятся корректно с учётом `basePath` (нет битых путей)
- [ ] README содержит все перечисленные разделы и актуален
- [ ] `.nojekyll` присутствует (иначе `_next` будет проигнорирован)

**Code Review:**

- [ ] Запустить агента `code-reviewer` (Task) по диффу шага (включая workflow и README)
- [ ] Прогнать skill `/code-review`
- [ ] Исправить замечания

---

## Соответствие ТЗ (чек обязательных требований)

- [ ] Next.js + TypeScript, App Router обоснован → Шаг 0, 9
- [ ] Strong types, no `any` → Шаг 0 (сквозное)
- [ ] Loading/empty/error states → Шаг 1
- [ ] Responsive → сквозное (mobile-first)
- [ ] Accessible → Шаг 6 (закладка с Шага 0)
- [ ] Launches List: server pagination → Шаг 0
- [ ] Фильтры upcoming/past, success/fail, date range → Шаг 2
- [ ] Sort by date/name → Шаг 2
- [ ] Search by mission name → Шаг 2
- [ ] Infinite scroll / Load more → Шаг 0 + 3
- [ ] Skeletons + error с retry → Шаг 1
- [ ] Launch Detail `/launches/[id]` + rocket + launchpad → Шаг 4
- [ ] Flickr gallery → Шаг 4
- [ ] Favorites + LocalStorage + favorites page → Шаг 5
- [ ] React Query: cache/dedupe/background refresh → Шаг 0
- [ ] Retry/backoff 429/5xx → Шаг 1
- [ ] Virtualization (react-window) → Шаг 3
- [ ] Memoization → Шаг 3
- [ ] A11y → Шаг 6
- [ ] Styling (Tailwind) → Шаг 0
- [ ] README со всеми разделами → Шаг 9
