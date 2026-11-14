# Bug Assessment: Quarter-hour numerals are not red on the analog clock

- **Slug**: add-red-color-analog-numbers
- **Created**: 2026-11-12
- **Source**: pasted text
- **Verdict**: invalid (not a bug; matches the clarified specification)
- **Severity**: low

## Report (verbatim)

> The bug is "3, 6, 9, 12 numbers are not in the redcolor in the analog clock, only the lines are in
> red color" slug='add_red_color_analog_numbers' Or give a suitable slug name

## Symptom

On the analog dial, the numerals `3`, `6`, `9`, and `12` render in the default dark ink, while only
the tick marks at those four positions render in light red. The reporter expects the four numerals
themselves to be light red as well.

## Reproduction

1. Serve the project root with a static file server and open the page.
2. Look at the analog clock on the left.
3. Observe that the `3`, `6`, `9`, and `12` numerals are dark, and only the four tick marks at those
   positions are light red.

## Suspected Code Paths

- `index.html:37` — the `12` numeral has `analog-clock__numeral analog-clock__numeral--12` but no
  accent modifier.
- `index.html:40` — the `3` numeral has no accent modifier.
- `index.html:43` — the `6` numeral has no accent modifier.
- `index.html:46` — the `9` numeral has no accent modifier.
- `css/analog-clock.css:17-22` — `.analog-clock__numeral` explicitly sets `color: var(--color-ink)`.
- `css/analog-clock.css:140-141` — only `.analog-clock__tick--emphasis` uses
  `background-color: var(--color-accent)`.
- `specs/001-analog-digital-clock/spec.md:15` — the clarification states: "Show all twelve numerals,
  but make only the tick marks at the 3, 6, 9, and 12 positions light red."
- `specs/001-analog-digital-clock/spec.md:114-116` — FR-005 and FR-006 require all twelve numerals
  to use the default color and only the four tick marks to be light red.

## Root Cause Hypothesis

**Confidence: high.** This is not an implementation defect. The code matches the clarified
requirement exactly: all twelve numerals are dark, and only the tick marks at 3, 6, 9, and 12 are
light red. The reporter's expectation conflicts with the spec, so this is a design change request
rather than a bug. The existing validation and task T017 were explicitly written to confirm zero
accented numerals.

## Proposed Remediation

**Preferred (if the design should change):** Treat this as a specification change first. Update the
clarification in `spec.md`, FR-005, FR-006, SC-004, and the analog acceptance scenarios so the
numerals at 3, 6, 9, and 12 are also light red (or introduce a separate, explicit rule for them).
Then add an accent modifier such as `analog-clock__numeral--emphasis` to those four numerals in
`index.html`, and style it with `var(--color-accent)` in `css/analog-clock.css`. Update the
quickstart validation scenario that currently expects zero accented numerals.

**If the spec should stay as written:** Close this as "not a bug" with no code change. The current
behavior is intentional and already documented.

**Alternatives:**
- Accent the numerals but keep the tick marks dark, so the four quarter-hour positions are marked by
  text rather than by ticks.
- Accent both the numerals and the tick marks (the reporter's apparent expectation).
- Use a darker red for numeral text to preserve contrast, while keeping the lighter red for ticks.

**Files likely to change (only if the requirement changes):**
- `specs/001-analog-digital-clock/spec.md`
- `specs/001-analog-digital-clock/quickstart.md`
- `index.html`
- `css/analog-clock.css`

**Tests to add or update:**
- Manual check that exactly the `3`, `6`, `9`, and `12` numerals use the accent color and the other
  eight numerals remain dark.
- Update the quickstart's analog-tick scenario, which currently asserts that zero numerals are
  accented.
- Recheck contrast for accent-colored numeral text at the smallest responsive size.

## Risks & Considerations

- **Spec conflict:** The requested behavior directly contradicts FR-005, FR-006, SC-004, and the
  recorded clarification. Changing the code without changing the spec would leave the artifacts and
  the implementation inconsistent.
- **Text contrast:** The accent color `#e5534b` has a 3.7:1 contrast ratio against the white
  background. That is sufficient for the tick marks as graphical objects, but normal-sized text
  needs 4.5:1. The numerals are small at narrow viewports, so accenting them may reduce
  accessibility unless the red is darkened or the text is enlarged.
- **Color-only meaning:** The constitution says color must not be the only means of conveying
  information. The numerals already identify the positions, so this is not a blocker, but the
  design should keep the numerals readable.
- **Regression scope:** The change is cosmetic and limited to the analog dial; it does not affect
  timekeeping, the digital readout, or responsiveness.

## Open Questions

- [NEEDS CLARIFICATION: Is this a request to change the clarified design so the 3, 6, 9, and 12
  numerals are red, or was the original clarification misunderstood?]
- [NEEDS CLARIFICATION: Should the four tick marks remain red, or should the accent move entirely to
  the numerals?]
- [NEEDS CLARIFICATION: Is a darker red acceptable for numeral text to preserve 4.5:1 contrast at
  small sizes?]
