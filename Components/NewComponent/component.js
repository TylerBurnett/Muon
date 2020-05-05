import { ComponentBase } from "../../Component/Component";
import { MessageHeader } from "../../Component/Enums/MessageHeader";

window.addEventListener("DOMContentLoaded", (event) => {
	const myComponent = new MyComponent();
});

class MyComponent extends ComponentBase {
	constructor() {
		super();
	}
}
