# Analog and Digital Clock

A single-page clock that shows a live analog clock on the left and a live digital clock on the right.
The analog dial uses light red tick marks at 3, 6, 9, and 12. The digital readout uses a 12-hour
zero-padded format and highlights only the first hour digit in light red.

## Spec-driven development

This project was built with GitHub Spec Kit. The constitution, specification, plan, tasks, and
validation artifacts live under `.specify/` and `specs/001-analog-digital-clock/`. For a full
walkthrough of the workflow and the decisions made at each stage, see [SPECKIT.md](./SPECKIT.md).

## Run

The page uses native ES modules, so serve it with any static file server from this directory:

```text
npx serve .
```

or

```text
python -m http.server 8000
```

Then open the printed local URL, for example `http://localhost:8000`.

There is no build step and no runtime dependency.

## File layout

```text
index.html                 Page shell and clock markup
SPECKIT.md                 Spec Kit workflow walkthrough
css/
  styles.css               Entry stylesheet
  base.css                 Reset, design tokens, page background
  layout.css               Responsive two-column and stacked layout
  analog-clock.css         Dial, numerals, tick marks, hands
  digital-clock.css        Digital readout and leading-digit emphasis
js/
  main.js                  Shared time snapshot, scheduler, DOM wiring
  analog-clock.js          Analog hand rotation and accessible label
  digital-clock.js         12-hour formatting and digit updates
```

## Naming conventions

- Files and directories use `kebab-case`.
- CSS classes follow BEM: `block`, `block__element`, `block--modifier`.
- CSS custom properties use `--kebab-case`.
- JavaScript variables and functions use `camelCase`; constants use `UPPER_SNAKE_CASE`.
- DOM references use a `$` prefix.
- JavaScript hooks use `data-js-*` attributes rather than IDs.

## Behavior

- Both clocks read the device's local time from one shared snapshot.
- A one-second loop updates the display in place; the page never reloads.
- Midnight renders as `12:00 AM`; noon renders as `12:00 PM`.
- The analog dial exposes an accessible label, and the digital readout uses a `<time>` element.
- No `aria-live` region is used, so the clock does not announce every tick.
- A static time and a `<noscript>` notice provide a no-script baseline.

## Validation

Manual validation scenarios are documented in
`specs/001-analog-digital-clock/quickstart.md`. Automated unit tests are intentionally out of scope
for this project.
