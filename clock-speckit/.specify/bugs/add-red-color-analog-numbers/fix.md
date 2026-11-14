# Bug Fix: Light red numerals at 3, 6, 9, and 12 on the analog clock

- **Slug**: add-red-color-analog-numbers
- **Fixed**: 2026-11-14
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Added a `analog-clock__numeral--emphasis` modifier to the `3`, `6`, `9`, and `12` numerals and styled
it with `var(--color-accent)`, then brought the specification artifacts in line with that behavior.
The four quarter-hour tick marks stay light red, so numerals and ticks now share one accent.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `index.html` | modified | Added `analog-clock__numeral--emphasis` to the `12`, `3`, `6`, and `9` spans |
| `css/analog-clock.css` | modified | New `.analog-clock__numeral--emphasis { color: var(--color-accent); }` after the numeral angle modifiers |
| `specs/001-analog-digital-clock/spec.md` | modified | New 2026-11-14 clarification; FR-005, FR-006, SC-008 and the "Light red" assumption updated to require the shared accent at the 3:1 threshold |
| `specs/001-analog-digital-clock/quickstart.md` | modified | Scenario 3 renamed to cover numerals; scenarios 3 and 8 results updated |
| `specs/001-analog-digital-clock/data-model.md` | modified | `numerals` rules and analog validation rules now allow four accented numerals |
| `specs/001-analog-digital-clock/contracts/clock-ui.md` | modified | Class modifier list, visual contract rows, and page-structure annotation updated |
| `specs/001-analog-digital-clock/tasks.md` | modified | Phase 4 goal, independent test, and T015–T017 rewritten for accented numerals |
| `specs/001-analog-digital-clock/plan.md` | modified | Summary no longer says all numerals are dark |
| `specs/001-analog-digital-clock/research.md` | modified | Decision 6 scope and rationale cover the accented numerals |
| `SPECKIT.md` | modified | "What we built" bullets and the design-decision row match the new behavior |

## Diff Highlights (optional)

```css
/* css/analog-clock.css */
.analog-clock__numeral--emphasis {
  color: var(--color-accent);
}
```

```html
<!-- index.html -->
<span class="analog-clock__numeral analog-clock__numeral--3 analog-clock__numeral--emphasis"
  aria-hidden="true">3</span>
```

```markdown
<!-- specs/001-analog-digital-clock/spec.md -->
- **SC-008**: Accented numerals and light red tick marks achieve at least a 3:1 contrast ratio against
  the light page background, while default dark elements achieve at least a 4.5:1 contrast ratio. The
  4.5:1 text threshold does not apply to the four accented numerals.
```

## Tests Added or Updated

- No automated test suite exists in this project (the constitution excludes automated unit tests), so
  validation is manual/browser-based.
- `specs/001-analog-digital-clock/quickstart.md` scenario 3 — now asserts exactly four accented
  numerals **and** four accented tick marks, rather than zero accented numerals.
- `specs/001-analog-digital-clock/quickstart.md` scenario 8 — now separates the 3:1 accent threshold
  from the 4.5:1 default-element threshold.

## Local Verification

- Commands run: `node <temp>/static-server.js <project-root> 8123` → served the page locally.
- Browser (Chromium via the in-app browser) checks against `http://127.0.0.1:8123/index.html`:
  - `getComputedStyle` on all twelve numerals → `12`, `3`, `6`, `9` are `rgb(229, 83, 75)`
    (`#e5534b`, `--color-accent`); the other eight are `rgb(31, 41, 51)` (`--color-ink`).
  - Tick marks → exactly 4 with `background-color: rgb(229, 83, 75)`, 8 with ink.
  - Digital readout → only the leading hour digit is accent colored.
  - Contrast on white → accent `3.70:1`, ink `14.76:1`.
  - Console errors → none.

## Deviations from Assessment

1. **The assessment's verdict was `invalid`.** The user chose to proceed as a specification change, so
   the change was applied even though the code matched the old spec. The spec was amended first and
   the implementation followed, keeping artifacts consistent.
2. **Contrast decision differs from the proposal.** The assessment recommended a darker red for the
   numeral text to reach 4.5:1 (and the 2026-11-12 clarification agreed). The user instead chose to
   share `--color-accent` (`#e5534b`, 3.70:1) between numerals and ticks. FR-006, SC-008 and the
   assumptions were relaxed accordingly, and a superseding 2026-11-14 clarification records it. This
   is a documented constitution-compatible exception; the risk is noted below.
3. **Scope expanded beyond the four listed files.** The change also touched `data-model.md`,
   `contracts/clock-ui.md`, `tasks.md`, `plan.md`, `research.md`, and `SPECKIT.md` because each
   contained a now-false statement that numerals must never carry the accent.

## Follow-ups

- The accented numerals render at 3.70:1, below the usual 4.5:1 text threshold. At the narrowest
  responsive size the numerals drop to `0.9rem` bold; if an accessibility audit flags them, reintroduce
  a darker accent token (for example `#b3261e`, ~6.5:1) for numeral text only.
- `SPECKIT.md` "Current status" still lists T026–T028 from the earlier convergence run as open.
- Rerun `/speckit.analyze` to confirm no remaining artifact contradicts the new SC-008 wording.
