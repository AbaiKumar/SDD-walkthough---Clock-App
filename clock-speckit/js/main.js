import { renderAnalogClock } from './analog-clock.js';
import { renderDigitalClock } from './digital-clock.js';

const TICK_INTERVAL_MS = 1000;

function requireElement(selector) {
  const $element = document.querySelector(selector);

  if (!$element) {
    throw new Error(`Required element not found: ${selector}`);
  }

  return $element;
}

function toLocalIsoString(date) {
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const absoluteOffset = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absoluteOffset / 60)).padStart(2, '0');
  const offsetMins = String(absoluteOffset % 60).padStart(2, '0');
  const localIso = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 19);

  return `${localIso}${offsetSign}${offsetHours}:${offsetMins}`;
}

function createClockTime(date) {
  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const hours12 = hours24 % 12 || 12;
  const hoursPadded = String(hours12).padStart(2, '0');
  const minutesPadded = String(minutes).padStart(2, '0');
  const period = hours24 < 12 ? 'AM' : 'PM';
  const leadingHourDigit = hoursPadded.charAt(0);
  const trailingHourDigit = hoursPadded.charAt(1);
  const secondAngle = seconds * 6;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const hourAngle = ((hours12 % 12) + minutes / 60) * 30;
  const isoDateTime = toLocalIsoString(date);

  return {
    hours24,
    hours12,
    hoursPadded,
    leadingHourDigit,
    trailingHourDigit,
    minutes,
    minutesPadded,
    seconds,
    period,
    isoDateTime,
    secondAngle,
    minuteAngle,
    hourAngle,
  };
}

function startClock(onTick) {
  const now = new Date();
  const initialDelay = TICK_INTERVAL_MS - now.getMilliseconds();
  let intervalId = null;

  const timeoutId = setTimeout(() => {
    onTick(createClockTime(new Date()));
    intervalId = setInterval(() => {
      onTick(createClockTime(new Date()));
    }, TICK_INTERVAL_MS);
  }, initialDelay);

  return () => {
    clearTimeout(timeoutId);

    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  };
}

const $hourHand = requireElement('[data-js-hour-hand]');
const $minuteHand = requireElement('[data-js-minute-hand]');
const $secondHand = requireElement('[data-js-second-hand]');
const $analogLabel = requireElement('[data-js-analog-label]');
const $leadingDigit = requireElement('[data-js-leading-digit]');
const $trailingDigit = requireElement('[data-js-trailing-digit]');
const $minutes = requireElement('[data-js-minutes]');
const $period = requireElement('[data-js-period]');
const $timeElement = requireElement('[data-js-time-element]');

const analogElements = {
  $hourHand,
  $minuteHand,
  $secondHand,
  $analogLabel,
};

const digitalElements = {
  $leadingDigit,
  $trailingDigit,
  $minutes,
  $period,
  $timeElement,
};

const initialTime = createClockTime(new Date());

renderAnalogClock(analogElements, initialTime);
renderDigitalClock(digitalElements, initialTime);

startClock((clockTime) => {
  renderAnalogClock(analogElements, clockTime);
  renderDigitalClock(digitalElements, clockTime);
});
