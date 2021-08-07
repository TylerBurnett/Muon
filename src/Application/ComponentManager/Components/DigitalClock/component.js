window.addEventListener('DOMContentLoaded', (event) => {
  const myComponent = new MyComponent();
});

class MyComponent {
  constructor() {
    super();
    setInterval(this.mainLoop.bind(this), 1000);
  }

  mainLoop() {
    const timeTitle = document.getElementById('TimeTitle');
    const dateTitle = document.getElementById('DateTitle');

    const time = new Date();
    timeTitle.innerHTML = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    dateTitle.innerHTML = `${time.getDay()} | ${time.getMonth()} | ${time.getUTCFullYear()}`;
  }
}
