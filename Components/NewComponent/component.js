import { ComponentBase } from "../../src/Component/Component";
var os = require("os");

window.addEventListener("DOMContentLoaded", (event) => {
	const myComponent = new MyComponent();
});

class MyComponent extends ComponentBase {
	constructor() {
		super();

		this.cpuLoop();
	}

	cpuLoop() {
		var selector = document.getElementById("cpuIndicator");
		selector.innerHTML = os.cpus().toString();
	}
}