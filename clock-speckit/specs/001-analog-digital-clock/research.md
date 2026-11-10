# Phase 0 Research: Analog and Digital Clock

**Feature**: `001-analog-digital-clock` | **Date**: 2026-11-10

All Technical Context items were resolved from the feature spec and project constitution; no
`NEEDS CLARIFICATION` markers remain.

## Decision 1: Analog dial rendering approach

- **Decision**: Build the dial from semantic HTML elements styled with CSS, and rotate the hands with
  CSS `transform: rotate(...)`.
- **Rationale**: Keeps the dial inspectable in the DOM, avoids a rendering dependency, supports the
  constitution's semantic-HTML and simplicity principles, and allows the four emphasized tick marks
  to be targeted with a BEM modifier.
- **Alternatives considered**:
  - `<canvas>`: rejected because it hides content from assistive technology and requires redraw logic.
  - Inline SVG: viable, but adds a second styling model and is unnecessary for a twelve-mark dial.
  - CSS-only clock with no JavaScript: rejected because the hands cannot track real time.

## Decision 2: Static dial markup versus generated marks

- **Decision**: Render all twelve numerals and twelve hour tick marks statically in `index.html`, each
  with a position modifier class.
- **Rationale**: Guarantees a meaningful no-script baseline, keeps the visual contract reviewable,
  and avoids coupling the dial's existence to JavaScript execution. Twenty-four elements is a small,
  acceptable amount of markup.
- **Alternatives considered**:
  - Generate marks in JavaScript: rejected because the dial would be empty when scripting fails and
    because it complicates accessibility review.
  - Use a single element with repeating CSS gradients: rejected because individual marks could not be
    styled or labeled independently.

## Decision 3: Tick mark scope

- **Decision**: Draw twelve hour tick marks only, with the marks at 3, 6, 9, and 12 using the light red
  emphasis; do not add sixty minute ticks.
- **Rationale**: The spec refers to "all other tick marks" and defines emphasis only at the four
  quarter positions. Twelve marks keep the dial simple and readable, consistent with the "simple
  clock" request.
- **Alternatives considered**:
  - Sixty minute ticks: rejected as visual noise not requested by the spec.
  - Only four ticks: rejected because FR-006 implies other tick marks exist and must stay default.

## Decision 4: Time source and update loop

- **Decision**: Use one `setInterval` loop in `main.js` that reads `new Date()` on every tick, aligns
  the first tick to the next whole second, and passes a single time snapshot to both renderers.
- **Rationale**: Reading the device clock each tick prevents drift; one loop guarantees both clocks
  show the same instant. A one-second cadence satisfies the accuracy criterion and the ticking second
  hand.
- **Alternatives considered**:
  - Separate intervals per clock: rejected because the two displays could momentarily disagree.
  - `requestAnimationFrame`: rejected as unnecessary for a one-second display and more costly on
    battery.
  - Incrementing a stored counter: rejected because it drifts when the tab is throttled.

## Decision 5: 12-hour formatting and digit emphasis

- **Decision**: Convert with `hours % 12 || 12`, pad to two characters with `padStart(2, '0')`, derive
  the period as `hours < 12 ? 'AM' : 'PM'`, and render the first character in a dedicated span with the
  `digital-clock__digit--highlight` modifier.
- **Rationale**: Implements the clarified format (`09:05 AM`), guarantees a defined first digit at
  every hour including midnight and noon, and isolates the emphasized character from the rest of the
  readout.
- **Alternatives considered**:
  - Unpadded hours: rejected by the clarification because the highlighted first digit would change
    meaning below 10.
  - 24-hour format: rejected by the clarification.
  - Styling the whole hour: rejected because the spec requires only the first digit to be light red.

## Decision 6: Color tokens and contrast

- **Decision**: Define tokens on `:root`: `--color-surface: #ffffff`, `--color-ink: #1f2933`,
  `--color-accent: #e5534b` (light red). Use the accent only for the four quarter tick marks and the
  leading digital digit.
- **Rationale**: `#e5534b` against white measures approximately 3.7:1, meeting the spec's 3:1 marker
  requirement, while `#1f2933` against white exceeds 4.5:1 for default elements. Tokens keep the
  palette consistent and easy to adjust.
- **Alternatives considered**:
  - `#ff6b6b`: rejected because it falls below 3:1 against white.
  - Per-component hex values: rejected by the constitution's design-token rule.

## Decision 7: Responsive layout

- **Decision**: Use CSS Grid on the page container: two equal columns at 768 px and wider, one column
  below that. Place the analog section before the digital section in the DOM so the narrow layout
  stacks analog first without reordering.
- **Rationale**: Matches SC-001 and SC-002 exactly and keeps reading order consistent with visual
  order.
- **Alternatives considered**:
  - Flexbox with `order`: rejected because DOM order and visual order should agree for accessibility.
  - Fixed-width layout: rejected because it fails the narrow-screen criterion.

## Decision 8: Accessibility treatment

- **Decision**: Give the analog dial `role="img"` and a text alternative updated each tick (for
  example, "Analog clock showing 9:05 AM"). Render the digital readout in a `<time>` element with a
  machine-readable `datetime` attribute. Do not use an `aria-live` region.
- **Rationale**: Screen-reader users get the current time on demand without a per-second
  announcement storm. The `<time>` element exposes a standard, parseable value.
- **Alternatives considered**:
  - `aria-live="polite"` on the clock: rejected because it would announce every second or minute
    change and disrupt navigation.
  - Hiding the analog dial entirely: rejected because its label adds a useful description.

## Decision 9: Testing strategy

- **Decision**: Validate manually using the scenarios in [quickstart.md](./quickstart.md); create no
  automated unit tests.
- **Rationale**: The project constitution states automated unit tests are not required, and the
  feature is a small visual surface best checked in a browser.
- **Alternatives considered**:
  - Browser automation suite: rejected as disproportionate for a two-component page and outside the
    requested scope.
