import { DataType } from "../DataType.mjs";

export class SliderDataType extends DataType {
    constructor(label, name, defaultValue, min, max, step = 1, save = true) {
        super(label, name, defaultValue, null, save);
        this.min = min;
        this.max = max;
        this.step = step;
    }

    createHTML(componentId, callbackFn) {
        this.componentId = componentId;

        const div = document.createElement("div");

        div.id = `${this.componentId}_${this.name}_div`;

        const input = document.createElement("input");
        input.type = "range";
        input.id = `${this.componentId}_${this.name}`;
        input.name = this.name;
        input.min = this.min;
        input.max = this.max;
        input.step = this.step;
        input.value = this.defaultValue;

        const label = document.createElement("label");
        label.htmlFor = this.name;
        label.textContent = `${this.label}: `;

        if (!this.save) {
            input.dataset.nosave = "";
            label.textContent = `${this.label}*: `;
        }

        input.addEventListener("change", () => callbackFn());
        input.addEventListener("input", () => callbackFn());

        div.appendChild(label);
        div.appendChild(input);

        return div;
    }

    get disabled() {
        return this.valueElement.disabled;
    }

    set disabled(val) {
        this.valueElement.disabled = val;
    }

    get valueElement() {
        return document.getElementById(`${this.componentId}_${this.name}`);
    }

    get value() {
        return this.valueElement.value;
    }

    set value(val) {
        this.valueElement.value = val;
    }

    get parentElement() {
        return document.getElementById(`${this.componentId}_${this.name}_div`);
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