# Spec Kit Walkthrough: Analog and Digital Clock

This document explains **Spec Kit** and records how the toolkit was used to build the analog and
digital clock in this repository. It is a companion to the application [README.md](./README.md).

## What is Spec Kit?

[Spec Kit](https://github.com/github/spec-kit) is GitHub's open-source toolkit for **spec-driven
development (SDD)**. Instead of starting with code, you start with a written specification, turn it
into a plan and a task list, and only then implement. The specification stays the source of truth,
and every later artifact traces back to it.

Spec Kit provides:

- A project constitution for non-negotiable engineering rules.
- Slash commands for each stage of the workflow.
- Templates for specifications, plans, tasks, and checklists.
- Helper scripts for feature setup and prerequisite checks.

In this project Spec Kit is installed through the **OpenCode** integration (version `1.2.5`) and
uses PowerShell scripts.

## The workflow at a glance

```text
Constitution -> Specify -> Clarify -> Checklist -> Plan -> Tasks -> Analyze -> Implement -> Converge
```

Each stage produces a durable artifact under `specs/001-analog-digital-clock/` or `.specify/`. The
next stage reads those artifacts instead of relying on chat history.

## How Spec Kit is set up here

| Path | Purpose |
|------|---------|
| `.specify/memory/constitution.md` | Project-wide MUST/SHOULD rules |
| `.specify/templates/` | Templates for specs, plans, tasks, and checklists |
| `.specify/scripts/powershell/` | Feature setup and prerequisite scripts |
| `.specify/workflows/speckit/workflow.yml` | Workflow definition |
| `.specify/feature.json` | Points at the active feature: `specs/001-analog-digital-clock` |
| `.opencode/commands/speckit.*.md` | Slash-command definitions used in OpenCode |
| `specs/001-analog-digital-clock/` | All artifacts for the clock feature |

The active feature was created with sequential numbering, so it is `001-analog-digital-clock`.

## What we built

A single static page with:

- A live **analog clock on the left** and a live **digital clock on the right**.
- All twelve hour numerals, with the 3, 6, 9, and 12 numerals in light red.
- **Light red tick marks** at the 3, 6, 9, and 12 positions only.
- A **12-hour, zero-padded** digital readout such as `09:05 AM`.
- **Only the first hour digit** in light red.
- A light background with dark default elements.
- Responsive stacking below 768 px.
- No framework, no build step, and no runtime dependency.

The implementation is plain HTML, CSS, and native ES modules.

## Step-by-step walkthrough

### 1. `/speckit.constitution`

**What it does:** Creates the project constitution, the governing rules for all later work.

**What we did:** Wrote `.specify/memory/constitution.md` version `1.0.0` with five core principles:

1. **Semantic HTML** — meaningful elements, one `<main>`, logical headings, accessible labels.
2. **Predictable CSS Architecture** — BEM class names, `kebab-case`, design tokens on `:root`,
   class-only styling, no `!important`, no inline `style` attributes.
3. **Explicit JavaScript Conventions** — ES modules, `const` by default, `camelCase`, `$`-prefixed
   DOM references, strict equality, no `console.log`, no inline event handlers.
4. **Consistent File and Identifier Naming** — `kebab-case` files, unique `kebab-case` IDs,
   `data-js-*` hooks for JavaScript.
5. **Simplicity, Accessibility, and Progressive Enhancement** — vanilla stack, no unnecessary
   dependencies, usable without JavaScript where practical, visible focus, color is never the only
   signal.

The constitution also added **Code Style & Structure**, **Development Workflow & Quality Gates**,
and **Governance** sections. It explicitly states that automated unit tests are not required and
that a manual review checklist gates every change.

**Artifact:** `.specify/memory/constitution.md`

### 2. `/speckit.specify`

**What it does:** Turns the feature request into a structured specification with user stories,
functional requirements, success criteria, edge cases, and assumptions.

**What we did:** Created `specs/001-analog-digital-clock/spec.md` with:

- **User Story 1 (P1)** — view both clocks side by side and see them update in sync.
- **User Story 2 (P2)** — identify the quarter-hour tick marks on the analog dial.
- **User Story 3 (P3)** — read the leading hour digit on the digital clock.
- **FR-001 through FR-012** — display, time source, live updates, hands, numerals, tick emphasis,
  12-hour format, leading-digit emphasis, AM/PM, responsive stacking, contrast, and offline use.
- **SC-001 through SC-008** — measurable layout, accuracy, emphasis, readability, performance, and
  contrast outcomes.
- **Edge cases** — midnight, noon, single-digit hours, time-zone changes, narrow screens, and
  long-running sessions.
- **Assumptions** — 12-hour convention, zero-padding, hours and minutes only, local device time,
  and a modern browser target.

**Artifact:** `specs/001-analog-digital-clock/spec.md`

### 3. `/speckit.clarify`

**What it does:** Finds ambiguous requirements and resolves them before planning, so the team does
not discover disagreements during implementation.

**What we did:** Resolved three questions and recorded them in the spec's Clarifications section:

| Question | Decision |
|----------|----------|
| Show all twelve numerals or only 3, 6, 9, 12? | Show **all twelve numerals**; accent only the **tick marks** at 3, 6, 9, and 12. |
| How should single-digit hours display? | **12-hour format with a leading zero**, for example `09:05 AM`. |
| Dark or light background? | **Light background** with dark default elements. |

These decisions flowed into FR-005, FR-006, FR-007, and FR-011.

**Artifact:** Updated `specs/001-analog-digital-clock/spec.md`

### 4. `/speckit.checklist`

**What it does:** Produces reviewer-owned quality checklists for the requirements and user
experience.

**What we did:** Created and completed two checklists:

| Checklist | Items | Result |
|-----------|-------|--------|
| `checklists/requirements.md` | 16 | 16/16 checked |
| `checklists/ux.md` | 36 | 36/36 checked |

The checklist gate passed before implementation began.

**Artifacts:** `specs/001-analog-digital-clock/checklists/requirements.md` and `ux.md`

### 5. `/speckit.plan`

**What it does:** Converts the specification into a technical plan, research notes, a data model, a
UI contract, and a validation quickstart.

**What we did:** Created:

- **`plan.md`** — stack, technical context, constitution check, and the source-code layout.
- **`research.md`** — decisions behind the vanilla stack, ES modules, CSS custom properties, the
  one-second scheduler, and the manual validation approach.
- **`data-model.md`** — the `ClockTime` value object, `AnalogDial`, `DigitalReadout`, derived hand
  angles, and validation rules.
- **`contracts/clock-ui.md`** — page structure, required `data-js-*` hooks, BEM class contract,
  visual contract, behavior contract, accessibility contract, and responsive contract.
- **`quickstart.md`** — eight manual validation scenarios.

Key plan decisions:

- Vanilla HTML/CSS/JS only; no framework and no build step.
- One shared time snapshot per tick, consumed by both renderers.
- A scheduler aligned to the next whole second, then a 1000 ms interval.
- BEM CSS with design tokens `--color-surface`, `--color-ink`, and `--color-accent`.
- A responsive breakpoint at 768 px.
- Manual validation instead of automated tests.

The plan's constitution check passed with no violations.

**Artifacts:** `plan.md`, `research.md`, `data-model.md`, `contracts/clock-ui.md`, `quickstart.md`

### 6. `/speckit.tasks`

**What it does:** Breaks the plan into an ordered, traceable task list grouped by user story.

**What we did:** Created `tasks.md` with **25 tasks in six phases**:

| Phase | Tasks | Purpose |
|-------|-------|---------|
| 1. Setup | T001–T003 | HTML shell, CSS entry point, design tokens |
| 2. Foundational | T004–T005 | Shared time snapshot and scheduler |
| 3. User Story 1 | T006–T014 | Side-by-side live analog and digital clocks |
| 4. User Story 2 | T015–T017 | Quarter-hour tick emphasis |
| 5. User Story 3 | T018–T021 | Leading hour digit emphasis |
| 6. Polish | T022–T025 | README, manual validation, naming review, cleanup |

The task list includes parallel markers, dependency notes, checkpoints, and an MVP-first execution
strategy. Automated test tasks were intentionally excluded because the constitution and spec put
them out of scope.

**Artifact:** `specs/001-analog-digital-clock/tasks.md`

### 7. `/speckit.analyze`

**What it does:** Checks the spec, plan, and tasks against each other for consistency, coverage, and
constitution alignment before code is written.

**What we did:** Ran the cross-artifact review to confirm that every functional requirement and
success criterion had a path through the plan and task list, and that no task contradicted the
constitution. No blocking gaps were found, so implementation proceeded.

### 8. `/speckit.implement`

**What it does:** Executes the task list, marks completed tasks `[X]`, and validates the result.

**What we did:** Implemented all 25 tasks and created:

| File | Purpose |
|------|---------|
| `index.html` | Page shell, analog dial, digital readout, no-script baseline |
| `css/styles.css` | Single stylesheet entry point |
| `css/base.css` | Reset, typography, design tokens |
| `css/layout.css` | Responsive two-column and stacked layout |
| `css/analog-clock.css` | Dial, numerals, tick marks, hands |
| `css/digital-clock.css` | Digital readout and leading-digit accent |
| `js/main.js` | Shared time snapshot, scheduler, DOM wiring |
| `js/analog-clock.js` | Hand rotation and accessible label |
| `js/digital-clock.js` | 12-hour formatting and digit updates |
| `README.md` | Run instructions, layout, conventions |
| `.gitignore` | OS, editor, Node, and environment ignores |

Validation was performed manually in Chromium. Results:

| Check | Result |
|-------|--------|
| Side-by-side layout | Two columns at 912 px and 900 px |
| Live in-place updates | `datetime` advanced after 2.2 seconds with no navigation |
| Analog tick emphasis | 12 ticks, exactly 4 accented, 0 accented numerals |
| Digital leading-digit emphasis | `12:20 PM` and `09:05 AM` highlight only the first hour digit |
| Midnight and noon | `12:00 AM` and `12:00 PM` render correctly |
| Responsive stacking | Single 468 px column at a 500 px viewport, no overflow |
| Offline behavior | No external resources requested |
| Contrast | Accent 3.7:1, ink 14.76:1 |
| Lighthouse | Accessibility 1.0, Best Practices 1.0, SEO 1.0 |
| Console | No errors |
| No-script baseline | Static `12:00 AM` plus a `<noscript>` notice |

### 9. `/speckit.converge`

**What it does:** Re-reads the spec, plan, tasks, and constitution, assesses the current code, and
appends any remaining work as new traceable tasks. It is append-only: it does not rewrite existing
tasks or modify application code.

**What we did:** Ran a convergence assessment after implementation. It found three gaps:

| ID | Gap | Severity | Source |
|----|-----|----------|--------|
| F1 | Eight template literals use backticks instead of the constitution's required single quotes | CRITICAL | Constitution Code Style |
| F2 | Two lines are 101 characters, above the 100-character guideline | LOW | Constitution Code Style |
| F3 | A `meta description` and a `<time>` `aria-label` were added but not explicitly requested | LOW | Spec/plan scope |

The assessment appended **Phase 7: Convergence** with tasks **T026–T028**. A second convergence run
correctly found no new work because those three tasks were still open; it did not duplicate them.

## Key design decisions

| Decision | Rationale |
|----------|-----------|
| Vanilla HTML/CSS/JS | The constitution defaults to a dependency-free stack; no framework or build step is needed. |
| BEM plus design tokens | Predictable styling and one place to change colors and spacing. |
| One shared time snapshot | Both clocks always agree within a tick. |
| One-second scheduler aligned to the next second | The display stays close to the device clock without drift. |
| 12-hour zero-padded format | Matches the requested `12:20` example and makes the leading digit well defined. |
| All twelve numerals, four accented numerals and ticks | The clarification chose numerals for readability and accents for the quarter-hour markers. |
| Light background, dark elements | Matches the clarified visual direction and keeps contrast high. |
| Static no-JS baseline | The page still communicates a time and an explanation when scripting is unavailable. |
| Manual validation | The constitution and spec explicitly exclude automated unit tests. |

## Current status

- **25 of 28 tasks are complete** and marked `[X]`.
- **T026–T028 remain open** under `## Phase 7: Convergence`:
  - **T026 (CRITICAL)** — replace the eight template literals in `js/main.js`,
    `js/analog-clock.js`, and `js/digital-clock.js` with single-quoted strings and concatenation.
  - **T027 (LOW)** — wrap the 101-character lines in `index.html` and `README.md`.
  - **T028 (LOW)** — review the unrequested `meta description` and `<time>` `aria-label`, then
    keep them with documented justification or remove them.

### Next steps

1. Run `/speckit.implement` to complete T026–T028.
2. Run `/speckit.converge` again to confirm the implementation is clean.
3. Review the result and open a pull request.

No `.specify/extensions.yml` file exists, so no extension hooks are registered.

## Command reference

| Command | Purpose |
|---------|---------|
| `/speckit.constitution` | Create or amend the project constitution |
| `/speckit.specify` | Write the feature specification |
| `/speckit.clarify` | Resolve ambiguous requirements |
| `/speckit.checklist` | Generate requirements and UX quality checklists |
| `/speckit.plan` | Produce the technical plan and supporting design artifacts |
| `/speckit.tasks` | Break the plan into ordered, traceable tasks |
| `/speckit.analyze` | Check cross-artifact consistency and coverage |
| `/speckit.implement` | Execute the task list and validate the result |
| `/speckit.converge` | Append any remaining work found after implementation |

## Why this workflow helped

- **Clarify before plan.** The numeral/tick-mark question and the zero-padding question could have
  caused rework. Resolving them first kept the plan and tasks unambiguous.
- **The constitution is enforceable.** Naming, CSS architecture, and JavaScript conventions became
  review criteria instead of personal preferences.
- **Traceability.** Every task points back to a user story, requirement, or plan decision, so it is
  clear why the work exists.
- **Converge catches drift.** The post-implementation pass found a real constitution violation that
  ordinary feature testing would not catch.
- **Validation is documented.** The eight quickstart scenarios record what was checked and what
  passed, which makes handoff and review easier.
