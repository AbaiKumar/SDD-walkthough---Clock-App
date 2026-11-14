# Bug Verification: Light red numerals at 3, 6, 9, and 12 on the analog clock

- **Slug**: add-red-color-analog-numbers
- **Tested**: 2026-11-14
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: partial

## Summary

The original symptom no longer reproduces: the `3`, `6`, `9`, and `12` numerals now render in
`--color-accent`, the other eight numerals stay dark, and both clocks still update in place with no
console errors. The only failing check is the contrast tradeoff the assessment predicted: Lighthouse
drops to an accessibility score of 0.94 and reports `color-contrast` on an accented numeral, because
`#e5534b` measures 3.70:1 rather than 4.5:1.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Served the project root on `http://127.0.0.1:8124`, inspected `getComputedStyle` of all 12 numerals | pass | `12`, `3`, `6`, `9` = `rgb(229, 83, 75)`; the other 8 = `rgb(31, 41, 51)` |
| New / updated tests | quickstart.md scenario 3 equivalent: count accented numerals and ticks | pass | 12 numerals, exactly 4 accented; 12 ticks, exactly 4 accented |
| Regression: digital emphasis | quickstart.md scenario 4 equivalent on the live page | pass | only the leading hour digit is accent colored; colon, minutes, period stay ink |
| Regression: live updates | Wait for the second-hand `transform` to change, with a page sentinel | pass | hand advanced, sentinel survived, URL unchanged — no reload |
| Regression: default elements | Computed colors of hands and the eight dark numerals | pass | all `rgb(31, 41, 51)` |
| Console errors | Browser console, `level: error` | pass | none |
| Accessibility / contrast audit | `browser.lighthouse` | fail | accessibility 0.94; `color-contrast` failure on `span.analog-clock__numeral--emphasis` |
| Responsive stacking | quickstart.md scenario 6 | not-run | browser session cannot resize the viewport; the change is color-only and scenario 6 passed in the earlier 2026-11-10 run |
| Lint / type-check | — | not-run | the project has no `package.json`, linter, or type checker |

## Output Excerpts

```text
accentNumerals: ["3", "6", "9", "12"]
accentTicks:    ["3", "6", "9", "12"]
darkNumeralCount: 8
darkTickCount: 8
accentNumeralContrast: 3.7   (on rgb(255, 255, 255))
inkNumeralContrast:   14.76
```

```text
Lighthouse accessibility: 0.94
  color-contrast — "Background and foreground colors do not have a sufficient contrast ratio."
  node: span.analog-clock__numeral analog-clock__numeral--12 analog-clock__numeral--emphasis
```

## Residual Risks

- Accented numerals render at 3.70:1, below the WCAG AA 4.5:1 threshold for text. This is explicitly
  waived in SC-008 as amended on 2026-11-14, but it is a real accessibility-audit regression from the
  pre-fix accessibility score of 1.0.
- At narrow viewports the numeral font shrinks to `0.9rem` (14.4 px) while staying bold; the contrast
  ratio is unchanged, but legibility of low-contrast small text is worse.
- Responsive stacking was not re-exercised in this run, so only earlier validation covers it.
- The eight dark numerals and all tick marks were unchanged, and no layout or timing code was touched.

## Recommendation

Close the bug for the reported symptom: the accent now applies to the `3`, `6`, `9`, and `12` numerals
and matches the amended specification. Treat the Lighthouse `color-contrast` finding as the accepted
tradeoff recorded in `fix.md`; if accessibility is a merge gate, reopen and switch the four numerals to
a darker accent token (for example `#b3261e`, ~6.5:1) before closing.
