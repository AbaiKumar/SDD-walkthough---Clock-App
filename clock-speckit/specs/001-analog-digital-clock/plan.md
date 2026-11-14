# Implementation Plan: Analog and Digital Clock

**Branch**: `001-analog-digital-clock` | **Date**: 2026-11-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-analog-digital-clock/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Build a single static page that shows a live analog clock on the left and a live digital clock on the
right. The analog dial renders all twelve numerals, with the numerals and tick marks at 3, 6, 9, and
12 in light red. The digital readout uses a 12-hour zero-padded format (`09:05 AM`) and renders only
the first hour digit in light red. Both clocks derive from one local-time source and update in place
every second, with no full page reload. The implementation uses semantic HTML, BEM-styled CSS with
design tokens, and vanilla ES modules, with no framework, build step, or automated unit tests.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES2020+ (native ES modules)

**Primary Dependencies**: None at runtime; an optional static file server is used only for local
development because ES modules do not load over `file://`

**Storage**: N/A — no persistence; the device clock is the only data source

**Testing**: Manual validation per [quickstart.md](./quickstart.md); automated unit tests are
explicitly out of scope per the project constitution and feature spec

**Target Platform**: Modern desktop and mobile browsers (latest two versions of Chrome, Edge,
Firefox, and Safari)

**Project Type**: Single-page static web application

**Performance Goals**: Both clocks visible within 2 seconds on broadband; displayed time within 1
second of the device clock; visual updates every second with no layout shift

**Constraints**: Works offline after initial load; no frameworks or build tooling; time updates in
place every second without a full page reload; responsive breakpoint at 768 px; light red markers meet
at least 3:1 contrast and dark elements at least 4.5:1 against the light background; inline styles and
inline scripts prohibited

**Scale/Scope**: One page, two clock components, twelve numerals, twelve hour tick marks, three
analog hands, one digital readout

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|------|--------|----------|
| I. Semantic HTML | PASS | `main`, `section`, headings, and `<time>` carry meaning; analog dial uses `role="img"` with an accessible label; no clickable non-interactive elements |
| II. Predictable CSS Architecture | PASS | BEM blocks `analog-clock` and `digital-clock`; design tokens on `:root`; class-only styling; no inline styles or `!important` |
| III. Explicit JavaScript Conventions | PASS | ES modules, `const` by default, camelCase functions, `$`-prefixed DOM references, `handle*` handlers, strict equality, no globals |
| IV. Consistent File and Identifier Naming | PASS | kebab-case files; `data-js-*` hooks; kebab-case IDs and custom properties |
| V. Simplicity, Accessibility, and Progressive Enhancement | PASS | Vanilla stack, no dependencies, readable without scripting for the digital time baseline, visible contrast, no color-only meaning |
| Code Style & Structure | PASS | Two-space indentation, external CSS/JS only, separated `css/` and `js/` directories, one concern per file |
| Development Workflow & Quality Gates | PASS | Manual review checklist covers HTML validity, responsive widths, keyboard/focus, naming, and debug cleanup; no unit tests required |

No violations; Complexity Tracking is not required.

**Post-Design Re-evaluation (Phase 1)**: PASS. The UI contract, data model, and quickstart preserve
semantic markup, BEM naming, token-based color, vanilla ES modules, and the manual quality gates. No
new dependencies or violations were introduced by the design artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/001-analog-digital-clock/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/
│   └── clock-ui.md      # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html                 # Page shell, clock markup, accessible labels
css/
├── styles.css             # Single entry stylesheet that imports the layers below
├── base.css               # Reset, tokens, typography, page background
├── layout.css             # Responsive two-column / stacked layout
├── analog-clock.css       # Dial, numerals, tick marks, hands
└── digital-clock.css      # Digital readout and leading-digit emphasis
js/
├── main.js                # Entry module: starts both clocks from one time source
├── analog-clock.js        # Analog hand rotation and accessible label updates
└── digital-clock.js       # 12-hour formatting and digit emphasis
```

**Structure Decision**: A single static site at the repository root, matching the constitution's
required layout (`index.html`, `css/`, `js/`). No `assets/` directory is needed because the clocks use
no images or custom fonts. No `tests/` directory is created because automated tests are out of scope.

## Complexity Tracking

> No constitution violations; this section is intentionally empty.
