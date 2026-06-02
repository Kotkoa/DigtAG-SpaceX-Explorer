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

- [x] IntersectionObserver → автоподгрузка (реализована через `onRowsRendered` react-window v2)
- [x] Виртуализация списка (`react-window`)
- [x] Мемоизация карточек/селекторов
- [x] Сохранение работы фильтров/поиска вместе с infinite scroll

**Acceptance Criteria:**

- [x] При прокрутке к концу списка следующая страница подгружается автоматически (IntersectionObserver)
- [x] Список виртуализирован: в DOM присутствует только видимый набор узлов (проверить в DevTools), а не все загруженные элементы
- [x] Карточки мемоизированы — нет лишних ререндеров при подгрузке (проверить React DevTools Profiler)
- [x] Скролл плавный (нет заметных фризов) на длинной выборке
- [x] Фильтры/поиск/сортировка из Шага 2 продолжают работать совместно с infinite scroll
- [x] Плавный скролл на mobile/tablet/desktop

**Code Review:**

- [x] Запустить агента `code-reviewer` (Task) по диффу шага
- [x] Прогнать skill `/code-review`
- [x] Исправить замечания

## Шаг 4 — Launch Detail `/launches/[id]`

> **Skill:** `nextjs-developer`

- [x] `generateStaticParams` → `[]` (динамика на клиенте, совместимо с export)
- [x] Client-side фетч launch по ID
- [x] Связанные `rocket` и `launchpad` (фетч по их ID)
- [x] Инфо: имя, дата, success, details, links
- [x] Галерея Flickr-изображений (если есть)
- [x] Loading/error/empty состояния для детали и связанных сущностей

**Acceptance Criteria:**

- [x] Переход на `/launches/[id]` с карточки списка открывает корректную деталь
- [x] Прямой заход по URL (refresh) на `/launches/[id]` работает (export + client-side fetch)
- [x] Отображаются name, date, success, details, links (внешние ссылки открываются корректно)
- [x] Подгружаются и показываются связанные rocket и launchpad по их ID
- [x] Галерея Flickr рендерится при наличии изображений; при отсутствии — корректный fallback
- [x] Loading/error состояния присутствуют, error имеет retry
- [x] Несуществующий ID → корректный not-found/error-state, без падения
- [x] Деталь читаема на mobile/tablet/desktop

**Code Review:**

- [x] Запустить агента `code-reviewer` (Task) по диффу шага
- [x] Прогнать skill `/code-review`
- [x] Исправить замечания

## Шаг 5 — Favorites

> **Skill:** `frontend-developer` (+ `vercel-composition-patterns` для дизайна хука/контекста)

- [x] Хук `useFavorites` (LocalStorage, типобезопасно)
- [x] Кнопка-закладка на карточке и в детали
- [x] Страница `/favorites` — просмотр/удаление

**Acceptance Criteria:**

- [x] Клик по закладке добавляет/убирает запуск из избранного; состояние кнопки отражает текущий статус
- [x] Избранное сохраняется в LocalStorage и переживает перезагрузку страницы
- [x] Страница `/favorites` показывает все сохранённые запуски, удаление работает и сразу обновляет UI
- [x] Пустое избранное → корректный empty-state
- [x] Закладка синхронизирована между списком, деталью и страницей favorites (single source of truth)
- [x] Хук типобезопасен (no `any`), устойчив к повреждённому/отсутствующему LocalStorage
- [x] Корректно на mobile/tablet/desktop

**Code Review:**

- [x] Запустить агента `code-reviewer` (Task) по диффу шага
- [x] Прогнать skill `/code-review`
- [x] Исправить замечания

## Шаг 6 — Accessibility аудит

> **Skill:** `web-design-guidelines`

- [x] Семантика проверена (landmarks, заголовки)
- [x] Labels на интерактивных элементах
- [x] Keyboard navigation по всем сценариям
- [x] Focus management (модалки/переходы) + `focus-visible`
- [x] ARIA где нужно
- [x] Контраст светлой темы

**Acceptance Criteria:**

- [x] Все интерактивные сценарии (фильтры, поиск, навигация, закладки, галерея) доступны только с клавиатуры
- [x] Видимый focus-ring (`focus-visible`) на всех фокусируемых элементах
- [x] Корректная семантика: landmarks (`header`/`main`/`nav`), иерархия заголовков, списки
- [x] Все контролы имеют доступные имена (label/aria-label); изображения — осмысленный alt
- [x] Динамические состояния (loading/error) озвучиваются (`aria-live` где уместно)
- [x] Контраст текста соответствует WCAG 2.1 AA
- [x] Прогон через axe/Lighthouse без критических нарушений a11y

**Code Review:**

- [x] Запустить агента `code-reviewer` (Task) по диффу шага
- [x] Прогнать skill `/code-review`
- [x] Исправить замечания

## Шаг 7 — Bonus: Графики статистики

> **Skill:** `frontend-developer`

- [x] Recharts: запуски по годам
- [x] Recharts: success rate
- [x] Страница `/stats`
- [x] Loading/empty/error состояния для агрегации

**Acceptance Criteria:**

- [x] На `/stats` отображаются два графика: запуски по годам и success rate
- [x] Графики построены на реальных данных API, цифры сходятся с выборкой
- [x] Есть loading-состояние и осмысленный empty/error-state
- [x] Графики responsive и читаемы на mobile/tablet/desktop
- [x] Графики доступны (заголовки/подписи осей, не только цвет как носитель смысла)

**Code Review:**

- [x] Запустить агента `code-reviewer` (Task) по диффу шага
- [x] Прогнать skill `/code-review`
- [x] Исправить замечания

## Шаг 8 — Тесты (Vitest + RTL)

> **Skill:** `tdd` (+ `react-vite-best-practices` для конфигурации Vitest)

- [x] Настройка Vitest + React Testing Library
- [x] Юнит-тест: построение query-параметров (фильтры/сортировка/поиск → тело query)
- [x] Юнит-тест: `useFavorites` (add/remove/persist/повреждённый storage)
- [x] Юнит-тест: логика фильтров

**Acceptance Criteria:**

- [x] `npm test` проходит полностью (зелёный), без флака
- [x] Покрыты: query-билдер, `useFavorites`, логика фильтров
- [x] Тесты проверяют поведение (а не реализацию), читаемы
- [ ] Скрипт `test` добавлен в `package.json`; тесты можно запускать в CI

**Code Review:**

- [x] Запустить агента `code-reviewer` (Task) по диффу шага
- [x] Прогнать skill `/code-review`
- [x] Исправить замечания

## Шаг 9 — Деплой Vercel (через GitHub CI) + README

> **Skill:** `vercel-composition-patterns`

**Откат GitHub Pages:**
- [x] Убрать `output: 'export'`, `basePath`, `assetPrefix`, `images.unoptimized` из `next.config.ts`
- [x] Удалить `.github/workflows/deploy.yml` (GitHub Pages workflow)
- [x] Удалить `public/.nojekyll`

**Vercel деплой:**
- [x] Деплой через Vercel Git Integration (прямой импорт репозитория — CI через GitHub Actions не нужен)
- [x] Auto-deploy на каждый push в `main`

**README:**
- [x] How to run
- [x] Architecture decisions (App vs Pages Router — обоснование)
- [x] Data layer (почему React Query)
- [x] SpaceX API usage (queries, pagination strategy)
- [x] Performance considerations (virtualization, memoization, background refresh)
- [x] Accessibility considerations
- [x] Tradeoffs / what next
- [x] Known limitations / TODOs
- [x] Обновить Live-ссылку на Vercel URL: https://digt-ag-space-x-explorer.vercel.app

**Acceptance Criteria:**

- [x] Деплой проходит без ошибок при push в `main` (Vercel Git Integration)
- [x] Живая ссылка Vercel открывается, все роуты работают при прямом заходе (`/launches/[id]`, `/favorites`, `/stats`)
- [x] Ассеты грузятся корректно (патчи через `/_next/image`, нет битых путей)
- [~] Preview URL — через Vercel Git Integration автоматически для PR (GitHub Actions CI не используется)
- [x] README содержит все разделы и актуальную Live-ссылку

**Code Review:**

- [x] Запустить агента `code-reviewer` (Task) по диффу шага
- [x] Прогнать skill `/code-review`
- [x] Исправить замечания

---

## Соответствие ТЗ (чек обязательных требований)

- [x] Next.js + TypeScript, App Router обоснован → Шаг 0, 9
- [x] Strong types, no `any` → Шаг 0 (сквозное)
- [x] Loading/empty/error states → Шаг 1
- [x] Responsive → сквозное (mobile-first)
- [x] Accessible → Шаг 6 (закладка с Шага 0)
- [x] Launches List: server pagination → Шаг 0
- [x] Фильтры upcoming/past, success/fail, date range → Шаг 2
- [x] Sort by date/name → Шаг 2
- [x] Search by mission name → Шаг 2
- [x] Infinite scroll / Load more → Шаг 0 + 3
- [x] Skeletons + error с retry → Шаг 1
- [x] Launch Detail `/launches/[id]` + rocket + launchpad → Шаг 4
- [x] Flickr gallery → Шаг 4
- [x] Favorites + LocalStorage + favorites page → Шаг 5
- [x] React Query: cache/dedupe/background refresh → Шаг 0
- [x] Retry/backoff 429/5xx → Шаг 1
- [x] Virtualization (react-window) → Шаг 3
- [x] Memoization → Шаг 3
- [x] A11y → Шаг 6
- [x] Styling (Tailwind) → Шаг 0
- [x] README со всеми разделами → Шаг 9
