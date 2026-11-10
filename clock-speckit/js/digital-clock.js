export function renderDigitalClock(elements, clockTime) {
  const { $leadingDigit, $trailingDigit, $minutes, $period, $timeElement } = elements;

  $leadingDigit.textContent = clockTime.leadingHourDigit;
  $trailingDigit.textContent = clockTime.trailingHourDigit;
  $minutes.textContent = clockTime.minutesPadded;
  $period.textContent = clockTime.period;
  $timeElement.dateTime = clockTime.isoDateTime;
  $timeElement.setAttribute(
    'aria-label',
    `${clockTime.hoursPadded}:${clockTime.minutesPadded} ${clockTime.period}`
  );
}
