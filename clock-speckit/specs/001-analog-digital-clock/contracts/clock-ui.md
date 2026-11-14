# UI Contract: Analog and Digital Clock

**Feature**: `001-analog-digital-clock` | **Date**: 2026-11-10

This project exposes no network API. Its interface is the rendered page: the DOM hooks, CSS class
names, and visual behavior that implementation and manual validation rely on.

## Page structure

```text
body
└── main.clock-page
    └── section.clock-layout
        ├── section.analog-clock[data-js-analog-clock]
        │   ├── heading (visually hidden or visible)
        │   └── div.analog-clock__dial[role="img"]
        │       ├── span.analog-clock__numeral (×12, four with --emphasis)
        │       ├── span.analog-clock__tick (×12, four with --emphasis)
        │       └── span.analog-clock__hand (hour, minute, second)
        └── section.digital-clock[data-js-digital-clock]
            ├── heading (visually hidden or visible)
            └── time.digital-clock__readout
                ├── span.digital-clock__digit--highlight
                ├── span.digital-clock__digit
                ├── span.digital-clock__separator
                ├── span.digital-clock__minutes
                └── span.digital-clock__period
```

The analog section MUST appear before the digital section in source order.

## Required data hooks

| Hook | Element | Purpose |
|------|---------|---------|
| `data-js-analog-clock` | Analog section | Root for analog rendering |
| `data-js-hour-hand` | Hour hand | Receives the hour rotation |
| `data-js-minute-hand` | Minute hand | Receives the minute rotation |
| `data-js-second-hand` | Second hand | Receives the second rotation |
| `data-js-analog-label` | Dial or section | Receives the accessible time description |
| `data-js-digital-clock` | Digital section | Root for digital rendering |
| `data-js-leading-digit` | First hour digit span | Receives the emphasized character |
| `data-js-trailing-digit` | Second hour digit span | Receives the remaining hour character |
| `data-js-minutes` | Minute span | Receives the two-digit minute value |
| `data-js-period` | Period span | Receives `AM` or `PM` |
| `data-js-time-element` | `<time>` element | Receives the `datetime` attribute |

Hooks MUST be selected once at startup and MUST NOT be re-queried on every tick.

## CSS class contract

- Blocks: `analog-clock`, `digital-clock`, `clock-page`, `clock-layout`.
- Elements: `analog-clock__dial`, `analog-clock__numeral`, `analog-clock__tick`,
  `analog-clock__hand`, `digital-clock__readout`, `digital-clock__digit`,
  `digital-clock__separator`, `digital-clock__minutes`, `digital-clock__period`.
- Modifiers: `analog-clock__numeral--emphasis` (positions 3, 6, 9, 12),
  `analog-clock__tick--emphasis` (positions 3, 6, 9, 12) and
  `digital-clock__digit--highlight` (first hour digit only).
- The light red color MUST come from the `--color-accent` custom property, never a literal value in a
  component rule.

## Visual contract

| Element | Required appearance |
|---------|---------------------|
| Page background | Light (`--color-surface`) |
| Numerals, default tick marks, hands, digital digits | Dark (`--color-ink`) |
| Numerals at 3, 6, 9, 12 | Light red (`--color-accent`) |
| Tick marks at 3, 6, 9, 12 | Light red (`--color-accent`) |
| First hour digit | Light red (`--color-accent`) |
| All other digital characters | Dark (`--color-ink`) |
| Accent contrast | At least 3:1 against the page background |
| Default element contrast | At least 4.5:1 against the page background |

## Behavior contract

- On load, both clocks render the current local time without user action.
- A one-second interval updates both clocks in place; the page MUST NOT reload, navigate, or remount.
- The digital readout follows `HH:MM AM` / `HH:MM PM`, zero-padded.
- Midnight renders `12:00 AM`; noon renders `12:00 PM`.
- The leading hour digit is the only accented character and changes only when the hour changes.
- Both clocks always show the same snapshot within a tick.

## Accessibility contract

- The analog dial exposes `role="img"` and an updated text alternative.
- The digital readout uses `<time>` with a valid `datetime` attribute.
- No `aria-live` region is used, so the clock does not announce every tick.
- Information is not conveyed by color alone: numerals and positions also identify the markers.
- All text and graphical elements meet the contrast values above.

## Responsive contract

| Viewport width | Layout |
|----------------|--------|
| 768 px and wider | Analog left, digital right, single row, no overlap |
| Below 768 px | Analog above digital, single column, no horizontal scrolling |
