---
description: "Task list for the Analog and Digital Clock feature"
---

# Tasks: Analog and Digital Clock

**Input**: Design documents from `/specs/001-analog-digital-clock/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated test tasks are included. The project constitution and feature spec explicitly exclude unit tests; validation is manual per `quickstart.md`.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Every task includes an exact file path

## Path Conventions

Single static site at the repository root, per `plan.md`: `index.html`, `css/`, and `js/`. No `src/` or
`tests/` directories are used.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the static page shell and the shared style layers.

- [X] T001 Create the HTML5 document shell with `lang="en"`, linked `css/styles.css`, and `<script type="module" src="js/main.js">` in `index.html`
- [X] T002 Create the single CSS entry point that imports `base.css`, `layout.css`, `analog-clock.css`, and `digital-clock.css` in `css/styles.css`
- [X] T003 [P] Create the reset, typography, and `:root` design tokens (`--color-surface: #ffffff`, `--color-ink: #1f2933`, `--color-accent: #e5534b`) in `css/base.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared time snapshot and update scheduler used by both clocks.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Implement `createClockTime(date)` in `js/main.js` producing `hours24` (0–23), `hours12` (1–12, with `hours24 % 12 || 12`), `hoursPadded` (exactly 2 digits via `padStart(2, '0')`), `leadingHourDigit` (one character), `trailingHourDigit` (one character), `minutes` (0–59), `minutesPadded` (exactly 2 digits), `seconds` (0–59), `period` (`AM` for 0–11, `PM` for 12–23), and `isoDateTime` (valid machine-readable date-time) in `js/main.js`
- [X] T005 Implement `startClock(onTick)` in `js/main.js` with a first tick aligned to the next whole second, a 1000 ms `setInterval`, a fresh `new Date()` read on every tick, and no page reload or remount

**Checkpoint**: Shared time source is ready; user stories can begin.

---

## Phase 3: User Story 1 - View Both Clocks Side by Side (Priority: P1) MVP

**Goal**: Show a live analog clock on the left and a live digital clock on the right, both reading the same local time and updating in place every second.

**Independent Test**: Open the page, confirm the analog clock is left and the digital clock is right, and confirm both advance without a page reload after at least 65 seconds.

### Implementation for User Story 1

- [X] T006 [US1] Build the page structure in `index.html`: `main.clock-page` containing `section.clock-layout` with an analog section marked `data-js-analog-clock` before a digital section marked `data-js-digital-clock`, each with a heading
- [X] T007 [P] [US1] Implement the responsive grid in `css/layout.css`: two equal columns at 768 px and wider, one column below 768 px, with no horizontal overflow
- [X] T008 [US1] Add the static analog dial markup in `index.html`: twelve numerals, twelve hour tick marks, and hour/minute/second hands carrying `data-js-hour-hand`, `data-js-minute-hand`, and `data-js-second-hand`; set `role="img"` and `data-js-analog-label` on the dial
- [X] T009 [P] [US1] Implement dial, numeral, tick, and hand base styles in `css/analog-clock.css`, using `--color-ink` for all dial elements and centering the three hands
- [X] T010 [P] [US1] Implement `renderAnalogClock(elements, clockTime)` in `js/analog-clock.js` applying `secondAngle = seconds × 6`, `minuteAngle = (minutes + seconds ÷ 60) × 6`, and `hourAngle = ((hours12 mod 12) + minutes ÷ 60) × 30`, and updating the accessible label to the current time
- [X] T011 [P] [US1] Implement the digital readout base styles in `css/digital-clock.css` using `--color-ink`, with a large, readable `HH:MM AM/PM` layout
- [X] T012 [P] [US1] Implement `renderDigitalClock(elements, clockTime)` in `js/digital-clock.js` producing `HH:MM AM` or `HH:MM PM` with zero-padded hours, rendering midnight as `12:00 AM` and noon as `12:00 PM`, and setting the `<time>` element's `datetime` attribute from `isoDateTime`
- [X] T013 [US1] Wire `js/main.js` to resolve all `data-js-*` hooks once, call both renderers with the initial snapshot, and pass each subsequent snapshot to both renderers from `startClock`
- [X] T014 [US1] Add accessible landmarks and clock labels in `index.html`, and confirm the digital `<time>` element exposes the visible time without an `aria-live` region

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Identify Quarter-Hour Markers on the Analog Clock (Priority: P2)

**Goal**: Make the tick marks at 3, 6, 9, and 12 light red while every numeral and every other tick mark stays dark.

**Independent Test**: Inspect the dial and confirm exactly four tick marks use the accent color, zero numerals use it, and all remaining ticks use the default color.

### Implementation for User Story 2

- [X] T015 [P] [US2] Add the `analog-clock__tick--emphasis` modifier to the tick marks at the 3, 6, 9, and 12 positions in `index.html`
- [X] T016 [P] [US2] Style `.analog-clock__tick--emphasis` with `var(--color-accent)` and keep `.analog-clock__numeral` and all other `.analog-clock__tick` elements on `var(--color-ink)` in `css/analog-clock.css`
- [X] T017 [US2] Reconcile markup and styles so exactly four tick marks are accented and no numeral is accented in `index.html` and `css/analog-clock.css`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Read the Leading Hour Digit on the Digital Clock (Priority: P3)

**Goal**: Render the first digit of the hour in light red while the second hour digit, colon, minutes, and period stay dark.

**Independent Test**: At `12:20 PM` only the `1` is light red; at `09:05 AM` only the leading `0` is light red; the accent follows the new leading digit after an hour change.

### Implementation for User Story 3

- [X] T018 [US3] Restructure the digital readout in `index.html` into separate spans for the leading digit (`data-js-leading-digit`), trailing digit (`data-js-trailing-digit`), separator, minutes (`data-js-minutes`), and period (`data-js-period`), all inside the `<time data-js-time-element>` element
- [X] T019 [P] [US3] Style `.digital-clock__digit--highlight` with `var(--color-accent)` and keep every other readout span on `var(--color-ink)` in `css/digital-clock.css`
- [X] T020 [US3] Update `renderDigitalClock(elements, clockTime)` in `js/digital-clock.js` to split `hoursPadded` into `leadingHourDigit` and `trailingHourDigit`, write the minutes and period spans, and keep the highlight on the leading digit only
- [X] T021 [US3] Verify and fix the leading-zero, midnight (`12:00 AM`), noon (`12:00 PM`), and hour-rollover cases across `index.html`, `css/digital-clock.css`, and `js/digital-clock.js`

**Checkpoint**: All three user stories work independently.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Project-level documentation, validation, and convention cleanup.

- [X] T022 [P] Create `README.md` documenting how to serve the static site, the file layout, and the naming conventions used by the clocks
- [X] T023 Run all eight manual scenarios in `specs/001-analog-digital-clock/quickstart.md` and record pass/fail results with the reviewer
- [X] T024 Review naming and style across `index.html`, `css/*.css`, and `js/*.js`, fixing kebab-case files, BEM classes, `data-js-*` hooks, and `camelCase`/`PascalCase`/`UPPER_SNAKE_CASE` identifiers
- [X] T025 Remove debug statements, unused code, inline styles, and inline scripts from `index.html`, `css/*.css`, and `js/*.js`; confirm no `!important`, `var`, or loose equality remains

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; no dependency on US2 or US3.
- **User Story 2 (Phase 4)**: Depends on US1's analog markup and styles.
- **User Story 3 (Phase 5)**: Depends on US1's digital markup and renderer.
- **Polish (Phase 6)**: Depends on all three user stories.

### User Story Dependencies

- **US1 (P1)**: Independent after Foundational; delivers the MVP.
- **US2 (P2)**: Adds accent styling to the US1 dial; independently testable once US1 exists.
- **US3 (P3)**: Adds digit emphasis to the US1 readout; independently testable once US1 exists.
- US2 and US3 both edit `index.html`, so coordinate those edits or run them sequentially.

### Within Each User Story

- Markup and structure before styling and rendering.
- Shared snapshot before renderer wiring.
- Core implementation before accessibility and consistency passes.
- Complete one story checkpoint before starting the next priority.

### Parallel Opportunities

- Setup: T003 can run alongside T001 and T002.
- US1: T007, T009, T011, T010, and T012 touch separate files and can run together after T006 and T008.
- US2: T015 and T016 touch separate files and can run together.
- US3: T018 and T019 touch separate files and can run together; T020 follows T018.
- Polish: T022 can run while T023–T025 are being prepared.

---

## Parallel Example: User Story 1

```text
Task: "Implement the responsive grid in css/layout.css"
Task: "Implement dial, numeral, tick, and hand base styles in css/analog-clock.css"
Task: "Implement renderAnalogClock in js/analog-clock.js"
Task: "Implement digital readout base styles in css/digital-clock.css"
Task: "Implement renderDigitalClock in js/digital-clock.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the side-by-side live clocks.
5. Deploy or demo the MVP.

### Incremental Delivery

1. Setup + Foundational → shared time source ready.
2. Add US1 → validate live side-by-side clocks → demo.
3. Add US2 → validate quarter-hour tick emphasis → demo.
4. Add US3 → validate leading-digit emphasis → demo.
5. Complete Polish → final validation and documentation.

### Parallel Team Strategy

1. Complete Setup and Foundational together.
2. One developer completes US1.
3. After US1, one developer takes US2 and another takes US3, coordinating edits to `index.html`.
4. Merge and run the Polish validation together.

---

## Notes

- [P] tasks touch different files and have no incomplete dependencies.
- [Story] labels map each task to its user story for traceability.
- No automated tests are generated; manual validation follows `quickstart.md`.
- Commit after each task or logical group.
- Stop at each checkpoint to validate the story independently.

---

## Phase 7: Convergence

- [ ] T026 CRITICAL: Replace all eight template literals in `js/main.js`, `js/analog-clock.js`, and `js/digital-clock.js` with single-quoted strings and concatenation per Constitution Code Style (`contradicts`)
- [ ] T027 Wrap the 101-character lines in `index.html` (the meta description) and `README.md` (the intro sentence) to stay under 100 characters per Constitution Code Style (`partial`)
- [ ] T028 Review the unrequested `meta name="description"` and `<time>` `aria-label` additions, then retain them with a documented justification in `README.md` or remove them per the spec/plan scope (`unrequested`)
