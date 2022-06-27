import { DataType } from "../DataType.mjs";

export class NumberDataType extends DataType {
    constructor(label, name, defaultValue) {
        super(label, name, defaultValue);
    }

    createHTML(componentId, callbackFn) {
        this.componentId = componentId;

        const div = document.createElement("div");

        div.id = `${this.componentId}_${this.name}_div`;

        const input = document.createElement("input");
        input.type = "number";
        input.id = `${this.componentId}_${this.name}`;
        input.name = this.name;
        input.value = this.defaultValue;

        const label = document.createElement("label");
        label.htmlFor = this.name;
        label.textContent = `${this.label}: `;

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
        if (typeof val === "string")
            val = parseInt(val);
        this.valueElement.value = Math.round(val);
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