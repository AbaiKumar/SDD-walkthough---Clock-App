# Spec Delta

## Purpose

Displays the current local time as an analog clock and a digital clock side by side on a single page, including the accent styling that marks selected hour positions and the leading hour digit.

## ADDED Requirements

### Requirement: Side-by-side clock layout

The page SHALL present the analog clock on the left and the digital clock on the right, in that horizontal order, within a single page without navigation.

#### Scenario: Both clocks are visible on load

- **WHEN** the page is opened in a browser
- **THEN** the analog clock appears on the left and the digital clock appears on the right
- **AND** both show the same moment in time

#### Scenario: Layout stays readable on a narrow viewport

- **WHEN** the browser viewport is too narrow to show both clocks side by side
- **THEN** the page stacks the clocks vertically instead of clipping or overlapping them
- **AND** no clock is hidden or cut off

### Requirement: Analog clock face

The analog clock SHALL render a circular dial with numerals 1 through 12 and 60 minute tick marks around its circumference.

#### Scenario: Dial contents are present

- **WHEN** the analog clock is rendered
- **THEN** all twelve hour numerals 1 through 12 are visible around the dial
- **AND** sixty tick marks mark the minute positions

#### Scenario: Hour numerals are positioned correctly

- **WHEN** the analog clock is rendered
- **THEN** the 12 numeral is at the top of the dial, 3 at the right, 6 at the bottom, and 9 at the left

### Requirement: Analog accent color

The analog clock SHALL render the 3, 6, 9, and 12 numerals in a light red color, while all other numerals use the default numeral color.

#### Scenario: Accented numerals are light red

- **WHEN** the analog clock is displayed
- **THEN** the numerals 3, 6, 9, and 12 are shown in light red

#### Scenario: Other numerals keep the default color

- **WHEN** the analog clock is displayed
- **THEN** the numerals 1, 2, 4, 5, 7, 8, 10, and 11 are not light red

### Requirement: Analog hands

The analog clock SHALL show an hour hand, a minute hand, and a second hand whose positions correspond to the current time.

#### Scenario: Hands reflect the current time

- **WHEN** the current time is 3:30:15
- **THEN** the hour hand points between 3 and 4
- **AND** the minute hand points at the 6 position
- **AND** the second hand points at the 3 position

#### Scenario: Second hand advances

- **WHEN** one second passes
- **THEN** the second hand advances to the next second position

### Requirement: Digital time format

The digital clock SHALL display the current local time in 12-hour format as zero-padded `HH:MM`, where the hour is always exactly two characters ranging from `01` to `12`.

#### Scenario: Morning time is zero-padded

- **WHEN** the current local time is 9:05 in the morning
- **THEN** the digital clock displays `09:05`

#### Scenario: Hour twelve is displayed as twelve

- **WHEN** the current local time is 12:20 (noon or midnight)
- **THEN** the digital clock displays `12:20`

### Requirement: Digital hour accent color

The digital clock SHALL render only the first character of the hour in light red. The second hour character, the colon, and both minute digits SHALL use the default text color.

#### Scenario: Two-digit hour accents the first digit

- **WHEN** the digital clock displays `12:20`
- **THEN** the `1` is light red
- **AND** the `2`, `:`, `2`, and `0` are not light red

#### Scenario: Zero-padded hour accents the leading zero

- **WHEN** the digital clock displays `09:05`
- **THEN** the leading `0` is light red
- **AND** the `9`, `:`, `0`, and `5` are not light red

### Requirement: Live updating

Both clocks SHALL update automatically to reflect the current time without requiring a page reload, and the two displays SHALL never disagree about the moment shown.

#### Scenario: Time advances without reload

- **WHEN** the page remains open as time passes
- **THEN** the digital clock updates and the analog hands move
- **AND** the user does not need to refresh the page

#### Scenario: Displays stay consistent

- **WHEN** either clock updates to a new time
- **THEN** both clocks show the same hour and minute

### Requirement: Local time source

Both clocks SHALL use the browser's local time zone as the source of the displayed time.

#### Scenario: Displayed time matches the local clock

- **WHEN** the user's device reports 14:20 local time
- **THEN** the digital clock shows the 12-hour equivalent `02:20`
- **AND** the analog hands match that same moment
