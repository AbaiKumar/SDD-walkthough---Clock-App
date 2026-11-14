# Data Model: Analog and Digital Clock

**Feature**: `001-analog-digital-clock` | **Date**: 2026-11-10

The feature has no stored data. Its model is an in-memory time snapshot derived from the device clock
on every tick, shared by both clock renderers.

## Entity: ClockTime

A value object representing one instant of local time.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `hours24` | integer | 0–23 | Hour in 24-hour form from the device clock |
| `hours12` | integer | 1–12 | Hour converted for display; midnight and noon both map to 12 |
| `hoursPadded` | string | exactly 2 digits | Zero-padded 12-hour value (`01`–`12`) |
| `leadingHourDigit` | string | one character, `0`–`9` or `1` | First character of `hoursPadded`; always defined |
| `trailingHourDigit` | string | one character, `0`–`9` | Second character of `hoursPadded` |
| `minutes` | integer | 0–59 | Minute value |
| `minutesPadded` | string | exactly 2 digits | Zero-padded minute value (`00`–`59`) |
| `seconds` | integer | 0–59 | Second value |
| `period` | string | `AM` or `PM` | Half-day indicator derived from `hours24` |
| `isoDateTime` | string | valid machine-readable date-time | Value for the digital `<time>` element's `datetime` attribute |

### Derived values

| Value | Formula | Range |
|-------|---------|-------|
| `secondAngle` | `seconds × 6` | 0–354 degrees |
| `minuteAngle` | `(minutes + seconds ÷ 60) × 6` | 0–<360 degrees |
| `hourAngle` | `((hours12 mod 12) + minutes ÷ 60) × 30` | 0–<360 degrees |

### Validation rules

- `hours12` MUST equal `hours24 mod 12`, with `0` rendered as `12`.
- `hoursPadded` MUST always contain two characters, so `leadingHourDigit` is never empty.
- `period` MUST be `AM` for `hours24` 0–11 and `PM` for `hours24` 12–23.
- `isoDateTime` MUST be produced from the same snapshot as the displayed values, never from a second
  clock read.

## Entity: AnalogDial

The circular face and its moving hands.

| Attribute | Cardinality | Rules |
|-----------|-------------|-------|
| `numerals` | 12 | Values 1–12; the numerals at 3, 6, 9, and 12 use the light red accent, all others use the default dark color |
| `tickMarks` | 12 | One per hour position; the marks at 3, 6, 9, and 12 use the light red accent, all others use the default color |
| `hourHand` | 1 | Rotated by `hourAngle` |
| `minuteHand` | 1 | Rotated by `minuteAngle` |
| `secondHand` | 1 | Rotated by `secondAngle` |
| `accessibleLabel` | 1 | Describes the current time, for example "Analog clock showing 9:05 AM" |

### Validation rules

- Exactly four numerals and four tick marks MUST carry the accent: positions 3, 6, 9, and 12.
- No numeral or tick mark outside those four positions may use the accent color.
- All three hands MUST update from the same `ClockTime` snapshot.
- The accessible label MUST be refreshed whenever the hands move.

## Entity: DigitalReadout

The textual time display.

| Attribute | Cardinality | Rules |
|-----------|-------------|-------|
| `leadingDigit` | 1 | First character of the hour; always light red |
| `trailingHourDigit` | 1 | Second character of the hour; default color |
| `separator` | 1 | `:`; default color |
| `minutes` | 1 | Two digits; default color |
| `period` | 1 | `AM` or `PM`; default color |
| `datetime` | 1 | Machine-readable value mirroring the displayed time |

### Validation rules

- Exactly one character in the readout MUST be light red: `leadingDigit`.
- The display MUST follow the pattern `HH:MM AM` or `HH:MM PM` with zero-padded hours.
- Midnight MUST render as `12:00 AM`; noon MUST render as `12:00 PM`.
- The leading digit MUST remain the same character until the hour changes.

## Relationships

```text
Device clock
    └── ClockTime (one snapshot per tick)
            ├── AnalogDial (hands + accessible label)
            └── DigitalReadout (text + emphasized digit)
```

Both displays consume the same snapshot, which guarantees they never disagree within a tick.

## State Transitions

| From | Trigger | To | Effect |
|------|---------|----|--------|
| Page loaded | Initial render | Showing current time | Hands and text reflect the first snapshot |
| Showing current time | One-second tick | Showing current time | Snapshot recomputed from the device clock; both displays update in place |
| Showing current time | Hour rollover | Showing new hour | Leading digit, period, and analog hour hand update |
| Showing current time | Time-zone or daylight-saving change | Showing new local time | Next tick reads the new local offset automatically |
| Showing current time | Tab hidden then restored | Showing current time | Next tick re-reads the device clock, so no drift accumulates |

There is no persistence, no user input, and no loading or error state: the device clock is always
available, and the page never reloads to refresh the time.
