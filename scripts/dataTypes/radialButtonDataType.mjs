import { DataType } from "../DataType.mjs";

export class RadialButtonDataType extends DataType {
    constructor(label, name, defaultValue, values, callbackFn = () => undefined, save = true) {
        super(label, name, defaultValue, callbackFn, save);
        this.values = values;
    }

    createHTML(componentId, callbackFn) {
        this.componentId = componentId;

        const div = document.createElement("div");

        div.id = `${this.componentId}_${this.name}`;

        const span = document.createElement("span");
        span.innerText = this.label;
        div.appendChild(span);
        div.appendChild(document.createElement("br"));

        this.values.forEach(value => {
            const input = document.createElement("input");
            input.type = "radio";

            // input.classList.add(`${this.componentId}_${this.name}`);
            input.dataset[`${componentId}`] = this.name;
            input.id = `${this.componentId}_${this.name}_${value.value}`;
            input.name = `${this.componentId}_${this.name}`;
            input.value = value.value;
            if (input.value == this.defaultValue) {
                input.checked = true;
            }

            input.addEventListener("input", () => callbackFn());
            input.addEventListener("input", () => this.callbackFn());

            const label = document.createElement("label");
            label.htmlFor = `${this.componentId}_${this.name}_${value.value}`;
            label.innerText = value.name;
            label.style.marginLeft = "1vw";

            div.appendChild(label);
            div.appendChild(input);
            div.appendChild(document.createElement("br"));
        });

        return div;
    }

    get valueElement() {
        return document.getElementById(`${this.componentId}_${this.name}`);
    }

    get parentElement() {
        return document.getElementById(`${this.componentId}_${this.name}`);
    }

    get value() {
        const elements = document.querySelectorAll(`[data-${this.componentId}]`);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.checked)
                return element.value;
        }
        return;
    }

    set value(val) {
        const elements = document.querySelectorAll(`[data-${this.componentId}]`);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.value == val) {
                element.checked = true;
            }
        }
    }

    toggle() {
        if (this.parentElement.hidden) {
            this.show();
        } else {
            this.hide();
        }
    }

    hide() {
        this.parentElement.hidden = true;
    }

    show() {
        this.parentElement.hidden = false;
    }
}