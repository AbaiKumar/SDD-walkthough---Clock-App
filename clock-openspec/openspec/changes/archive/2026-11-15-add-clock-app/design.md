# Design

## Context

The project has no application code yet; it contains only OpenSpec scaffolding. The deliverable is a small static clock page with no build step. See `proposal.md` for motivation and `specs/clock/spec.md` for the behavior contract.

Constraints that shape the approach:

- No package manager, bundler, or dev server should be required.
- The CSS accent requirements must be easy to locate and review, so styling stays in one file.
- Both clocks must agree, so a single time source drives both.

## Goals / Non-Goals

**Goals:**

- Three static files: `index.html` (structure), `style.css` (layout and accent styling), `clock.js` (time reading and rendering).
- Rendering that is deterministic enough to verify the accent rules by inspection.
- One accent color token reused by both clocks.

**Non-Goals:**

- No timezone selection, world clock, timers, alarms, or date display.
- No AM/PM marker; no 24-hour toggle.
- No persistence, routing, analytics, or accessibility certification beyond semantic markup and readable contrast.
- No build tooling or test framework.

## Decisions

### Static three-file layout instead of a framework

Plain HTML/CSS/JS opens directly from the filesystem and keeps the CSS requirements reviewable in a single stylesheet. A framework (React/Svelte) would add install and build steps for one page with no state beyond the clock. Alternative considered and rejected: a single self-contained HTML file — simpler to ship, but it puts CSS and JS in one file, making the accent rules harder to point at.

### CSS transforms for hands, JS only for the time values

`clock.js` reads `new Date()` once per tick and writes: rotation angles as CSS custom properties on the analog clock, and digit text content on the digital clock. All geometry and color live in CSS. This keeps the accent requirement purely declarative and avoids canvas, which would make the light-red rule a drawing call rather than CSS.

Alternative considered: `<canvas>` rendering — precise, but the accent rule would no longer be CSS, contradicting the requirement's framing.

### Analog dial built from absolutely positioned elements rotated around the center

- 60 tick marks generated in JS (or static markup) and positioned with `rotate(i * 6deg) translateY(-radius)`; every fifth tick is longer to mark hours.
- Numerals are individual elements placed at their clock positions, so `3`, `6`, `9`, and `12` can carry a dedicated class (`.accent`) rather than being styled by position.
- Hands are thin elements anchored at the dial center with `transform-origin: bottom center` and rotated by angle:
  - hour: `(h % 12 + m / 60) * 30`
  - minute: `(m + s / 60) * 6`
  - second: `s * 6`

Alternative considered: SVG for the dial — cleaner geometry, but more markup and no benefit for four hand rotations.

### Digital clock renders per-character spans

The digital display is a fixed set of character slots — `hour-tens`, `hour-ones`, `:`, `minute-tens`, `minute-ones` — each updated as text. Only the `hour-tens` span carries the accent class, which makes the "first digit only" rule structural rather than string-manipulation. A monospace font prevents layout shift as digits change.

Hour computation: `hour12 = hour % 12 || 12`, then zero-pad to two characters. Minute is zero-padded to two characters. Example: 14:20 local → `02:20`; 09:05 → `09:05`; 12:00 → `12:00`.

Alternative considered: rendering `HH:MM` as a single string with an inner `<span>` for the first character — similar result, but requires rebuilding the string each tick and risks losing the highlight if the string is re-parsed.

### Single loop with a one-second tick

`setInterval` at 1000 ms runs an update that recomputes everything from `new Date()`. Recomputing rather than incrementing keeps both clocks consistent and self-corrects after tab throttling or sleep. The second hand steps once per second rather than sweeping; a sweep would need `requestAnimationFrame` and is not required.

Risk: `setInterval` drifts slightly and is throttled in background tabs. Acceptable for a display-only clock, and self-correction on the next tick hides it.

### Accent token

`--accent: #ff6b6b` defined once on `:root` and referenced by the analog numeral class and the digital `hour-tens` slot. Changing the shade of "light red" is a one-line edit. Contrast against the dark dial background is sufficient for the numerals at their display size.

### Responsive behavior

Flex row by default; a media query around 720 px switches to a column so both clocks remain fully visible on narrow viewports.

### Live update binding

The tick function runs once immediately on load (so the first paint is never empty) and then every second.

## Risks / Trade-offs

- **Background-tab throttling** makes the second hand jump when the tab is inactive → Mitigation: every tick recomputes from `new Date()`, so it snaps to the correct time on return; no cumulative drift.
- **No AM/PM indicator** makes `12:20` ambiguous between noon and midnight → Accepted: the requirement specifies `HH:MM` only; mitigated by keeping the hour mapping to `01`–`12`.
- **Clock and content mismatch at minute boundaries** if the digital text updates and the analog hands update in separate passes → Mitigation: one update function drives both from a single `Date` instance.
- **`setInterval` drift** can lag real time by tens of milliseconds → Negligible for a clock face without displayed seconds digits.
- **Numerals overlapping tick marks** at longer tick lengths → Mitigation: tick length stays shorter than the numeral inset radius.

## Migration Plan

Greenfield: create the three files at the project root. Rollback is deleting them; nothing else depends on them. No data or schema migrations.
