# Tasks

## 1. Scaffold the static page

- [x] 1.1 Create `index.html` with a main container holding `<section id="analog-clock">` on the left and `<section id="digital-clock">` on the right, and verify by opening the file in a browser that both sections exist in that left-to-right order.
- [x] 1.2 Create empty `style.css` and `clock.js` and link both from `index.html`; verify in the browser devtools network/console panel that neither file 404s and no script error is logged.

## 2. Build the analog clock

- [x] 2.1 Add 60 tick marks positioned with `rotate(i * 6deg)` and a longer style for every fifth tick, and verify visually that the dial shows 12 long hour ticks and 48 short minute ticks.
- [x] 2.2 Add the twelve hour numerals positioned so 12 is at the top, 3 at the right, 6 at the bottom, and 9 at the left; verify visually that all numerals are legible and do not overlap the tick marks.
- [x] 2.3 Add an `accent` class to the 3, 6, 9, and 12 numerals and style it with `color: var(--accent)`, defining `--accent: #ff6b6b` on `:root`; verify that exactly those four numerals render light red and the other eight do not.
- [x] 2.4 Add hour, minute, and second hand elements anchored at the dial center with `transform-origin: bottom center`, and rotate them from CSS custom properties `--hour-angle`, `--minute-angle`, and `--second-angle`; verify with temporary hard-coded angles that each hand starts at 12 and sweeps clockwise.

## 3. Build the digital clock

- [x] 3.1 Add character slots `hour-tens`, `hour-ones`, a colon, `minute-tens`, and `minute-ones`, apply the `accent` class to `hour-tens` only, and verify in the browser that only the first hour character is light red while every other digit and the colon use the default color.
- [x] 3.2 Set the digital display to a monospace font at a fixed width per character slot, and verify that the layout does not shift when digits change (watch it across a minute rollover).

## 4. Wire up the time source

- [x] 4.1 In `clock.js`, implement a single `render(now)` function that reads one `Date` instance and derives `hour12 = hour % 12 || 12`, zero-padded hour and minute strings, and the three hand angles; verify by calling it with fixed dates (for example 09:05, 12:20, 14:20) in the console that it produces `09:05`, `12:20`, `02:20` and matching angles.
- [x] 4.2 Call `render(new Date())` once on load and then inside a `setInterval(…, 1000)`; verify that the digital text and analog hands are populated immediately on load and advance every second without a reload.

## 5. Integration verification

- [x] 5.1 Cross-check both displays against a reference clock at a minute rollover and confirm the hour and minute shown by the analog hands and the digital text always agree.
- [x] 5.2 Resize the browser narrow enough to trigger the stacking breakpoint and verify both clocks remain fully visible without clipping, and appear side by side again when the viewport is widened past roughly 720 px.
- [x] 5.3 Confirm the required accent rules end to end: 3, 6, 9, and 12 on the analog dial are light red, and only the first hour digit on the digital clock is light red.
