const component = require("../../dist/Component/Component.js");

window.addEventListener("DOMContentLoaded", (event) => {
  var myComponent = new MyComponent();
});

class MyComponent extends component.ComponentBase {
  constructor() {
    super();
    this.mainLoop();
  }

  //This analogue clock was taken from this codepen:
  //https://codepen.io/axelf/pen/MWaBLOp , thank you Alex
  mainLoop() {
    const clock = document.querySelector(".clock");
    const hours = document.querySelector(".hours");
    const seconds = document.querySelector(".seconds");
    const minutes = document.querySelector(".minutes");
    const degrees = 360;
    let seconds_angle = 0;
    let minutes_angle = 0;
    let hours_angle = 0;

    const init = () => {
      createIndicators();
      setHands();
      setInterval(runClock, 1000);
    };

    const setHands = () => {
      const date = new Date();
      const current_hour = date.getHours() - 12;
      const current_minute = date.getMinutes();
      const current_second = date.getSeconds();

      hours_angle =
        current_hour * 30 + ((current_minute - (current_minute % 15)) / 15) * 6;
      minutes_angle = current_minute * 6;
      seconds_angle = current_second * 6;

      hours.style.transform = "rotate(" + hours_angle + "deg)";
      minutes.style.transform = "rotate(" + minutes_angle + "deg)";
      seconds.style.transform = "rotate(" + seconds_angle + "deg)";
    };

    const runClock = () => {
      seconds.style.transform = "rotate(" + seconds_angle + "deg)";

      if (seconds_angle == degrees) {
        seconds_angle = 0;

        seconds.addEventListener("transitionend", function controlBouncing() {
          seconds.classList.add("no-transition");
          seconds.style.transform = "rotate(" + seconds_angle + "deg)";

          setTimeout(() => {
            seconds.classList.remove("no-transition");
          }, 200);

          seconds.removeEventListener("transitionend", controlBouncing);
          seconds_angle += degrees / 60;
        });

        minutes_angle += degrees / 60;
        minutes.style.transform = "rotate(" + minutes_angle + "deg)";

        if (minutes_angle % 15 == 0) {
          hours_angle += 6;
          hours.style.transform = "rotate(" + hours_angle + "deg)";
        }
      } else {
        seconds_angle += degrees / 60;
      }
    };

    const createIndicators = () => {
      for (let i = 0; i < 60; i++) {
        const indicator = document.createElement("div");
        indicator.classList.add("seconds-indicator");
        indicator.style.transform = "rotate(" + i * 6 + "deg)";

        if (i % 5 == 0) {
          indicator.classList.add("seconds-indicator--fifth");
        }

        clock.appendChild(indicator);
      }
    };

    init();
  }
}
