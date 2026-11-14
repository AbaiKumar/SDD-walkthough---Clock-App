(function () {
  "use strict";

  var face = document.getElementById("analog-face");
  var tickLayer = document.getElementById("ticks");

  var hourTens = document.getElementById("hour-tens");
  var hourOnes = document.getElementById("hour-ones");
  var minuteTens = document.getElementById("minute-tens");
  var minuteOnes = document.getElementById("minute-ones");

  // 60 minute tick marks; every fifth tick marks an hour.
  function buildTicks() {
    for (var i = 0; i < 60; i += 1) {
      var tick = document.createElement("div");
      tick.className = i % 5 === 0 ? "tick tick--hour" : "tick";
      tick.style.setProperty("--angle", i * 6 + "deg");
      tickLayer.appendChild(tick);
    }
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  // Renders both clocks from a single Date so they never disagree.
  function render(now) {
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // 12-hour, zero-padded: 0 -> 12, 9 -> 09.
    var hour12 = hours % 12 || 12;
    var hh = pad2(hour12);
    var mm = pad2(minutes);

    hourTens.textContent = hh.charAt(0);
    hourOnes.textContent = hh.charAt(1);
    minuteTens.textContent = mm.charAt(0);
    minuteOnes.textContent = mm.charAt(1);

    var hourAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30;
    var minuteAngle = (minutes + seconds / 60) * 6;
    var secondAngle = seconds * 6;

    face.style.setProperty("--hour-angle", hourAngle + "deg");
    face.style.setProperty("--minute-angle", minuteAngle + "deg");
    face.style.setProperty("--second-angle", secondAngle + "deg");
  }

  function tick() {
    render(new Date());
  }

  buildTicks();

  // Paint immediately, then every second.
  tick();
  setInterval(tick, 1000);

  // Exposed for manual verification with fixed dates.
  window.renderClock = render;
})();
