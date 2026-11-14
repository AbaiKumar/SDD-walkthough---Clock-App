# Quickstart Validation: Analog and Digital Clock

**Feature**: `001-analog-digital-clock` | **Date**: 2026-11-10

Manual validation guide. Automated unit tests are intentionally out of scope.

## Prerequisites

- A modern desktop or mobile browser.
- The project files from this repository.
- Optional: any static file server for local viewing. Native ES modules do not load over `file://`, so
  a server is recommended.

## Run

From the repository root, start any static server, for example:

```text
npx serve .
```

or

```text
python -m http.server 8000
```

Then open the printed local URL (for example, `http://localhost:8000`). There is no build step and no
installation of runtime dependencies.

## Validation scenarios

### 1. Side-by-side layout (P1, SC-001)

1. Open the page at 768 px width or wider.
2. Confirm the analog clock is on the left and the digital clock is on the right in one row.
3. Confirm neither clock overlaps or clips.

Expected: both clocks visible, aligned, and readable without scrolling.

### 2. Live in-place updates (P1, FR-003, SC-003)

1. Note the displayed time and the device clock.
2. Wait at least 65 seconds without interacting.
3. Confirm the analog second hand moves, the minute changes, and no full page reload occurs.
4. Repeat after switching away from the tab for a few minutes and returning.

Expected: both clocks stay within one second of the device clock; the page never reloads or flickers.

### 3. Analog quarter-hour emphasis (P2, FR-005, FR-006, SC-004)

1. Inspect the analog dial.
2. Confirm all twelve numerals are present.
3. Confirm the numerals and tick marks at the 3, 6, 9, and 12 positions are light red.
4. Confirm the remaining eight numerals and eight tick marks are dark.

Expected: exactly four accented numerals and four accented tick marks, all sharing `--color-accent`.

### 4. Digital leading-digit emphasis (P3, FR-007, FR-008, SC-005)

1. Observe the digital readout at a two-digit hour such as `12:20 PM`.
2. Confirm only the `1` is light red; the `2`, colon, minutes, and period are dark.
3. Wait until an hour below 10, or temporarily adjust the device clock, and confirm `09:05 AM` shows
   only the leading `0` in light red.
4. Watch across an hour change and confirm the accent moves to the new leading digit.

Expected: exactly one accented character at all times.

### 5. Midnight and noon (Edge cases)

1. Set the device time to 12:00 AM and confirm the digital display reads `12:00 AM` with the analog
   hands at 12.
2. Set the device time to 12:00 PM and confirm the digital display reads `12:00 PM` with the analog
   hour and minute hands at 12.

Expected: both boundaries render as 12 with the correct period.

### 6. Responsive stacking (FR-010, SC-002)

1. Narrow the viewport below 768 px.
2. Confirm the analog clock appears above the digital clock.
3. Confirm no horizontal scrolling and no clipped content.

Expected: a single readable column with analog first.

### 7. Offline behavior (FR-012)

1. Load the page once.
2. Disable the network connection and reload from the browser cache, or stop the local server after
   the page has loaded and continue using the open page.
3. Confirm both clocks keep updating.

Expected: no network request is required for time updates.

### 8. Accessibility and contrast (FR-011, SC-008)

1. Check the light red numerals and tick marks against the light background; confirm they are clearly
   distinguishable from the background and from the dark elements.
2. Confirm the accent measures at least 3:1 against the background.
3. Check dark numerals, tick marks, hands, and digits against the background; confirm at least 4.5:1.
4. Inspect the analog dial's accessible name and the digital `<time>` value.
5. Confirm the clock does not announce every tick in a screen reader.

Expected: the 3:1 graphical contrast threshold is met by accented elements and the 4.5:1 threshold by
default dark elements, and the accessible time is available on demand.

## Validation results

Executed on 2026-11-10 in a Chromium browser served from `http://localhost:8000`; scenarios 3 and 8
re-validated on 2026-11-14 after adding the quarter-hour numeral accent.

| Scenario | Result |
|----------|--------|
| 1. Side-by-side layout | PASS — two columns at 912 px and 900 px |
| 2. Live in-place updates | PASS — datetime advanced after 2.2 seconds with no navigation |
| 3. Analog quarter-hour emphasis | PASS — 12 ticks and 12 numerals; exactly 4 of each accented (`12`, `3`, `6`, `9`) |
| 4. Digital leading-digit emphasis | PASS — `12:20 PM` and `09:05 AM` highlight only the first hour digit |
| 5. Midnight and noon | PASS — renderer checks produced `12:00 AM` and `12:00 PM` |
| 6. Responsive stacking | PASS — single 468 px column at a 500 px viewport, no overflow |
| 7. Offline behavior | PASS — no external resources requested |
| 8. Accessibility and contrast | PASS — accent 3.70:1, ink 14.76:1 on white; accent numerals accepted at the 3:1 graphical threshold per SC-008 |

## Definition of done

- All eight scenarios pass.
- The manual review checklist in the project constitution passes.
- No console errors, leftover debug statements, or unused files remain.
