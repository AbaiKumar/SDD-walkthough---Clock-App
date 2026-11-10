export function renderAnalogClock(elements, clockTime) {
  const { $hourHand, $minuteHand, $secondHand, $analogLabel } = elements;

  // Only dynamic rotation values are applied inline; presentation stays in CSS.
  $hourHand.style.setProperty('--hand-rotation', `${clockTime.hourAngle}deg`);
  $minuteHand.style.setProperty('--hand-rotation', `${clockTime.minuteAngle}deg`);
  $secondHand.style.setProperty('--hand-rotation', `${clockTime.secondAngle}deg`);

  const accessibleTime = `${clockTime.hours12}:${clockTime.minutesPadded} ${clockTime.period}`;
  $analogLabel.setAttribute('aria-label', `Analog clock showing ${accessibleTime}`);
}
