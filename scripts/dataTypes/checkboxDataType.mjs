import { DataType } from "../DataType.mjs";

export class CheckboxDataType extends DataType {
    constructor(label, name, defaultValue, callbackFn = () => undefined, save = true) {
        super(label, name, defaultValue, callbackFn, save);
    }

    createHTML(componentId, callbackFn) {
        this.componentId = componentId;

        const div = document.createElement("div");

        div.id = `${this.componentId}_${this.name}_div`;

        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = `${this.componentId}_${this.name}`;
        input.name = this.name;
        input.checked = this.defaultValue;

        const label = document.createElement("label");
        label.htmlFor = this.name;
        label.textContent = `${this.label}: `;

        if (!this.save) {
            input.dataset.nosave = "";
            label.textContent = `${this.label}*: `;
        }

        input.addEventListener("input", () => this.callbackFn());
        input.addEventListener("input", () => callbackFn());

        div.appendChild(label);
        div.appendChild(input);

        return div;
    }

    get valueElement() {
        return document.getElementById(`${this.componentId}_${this.name}`);
    }

    get value() {
        return this.valueElement.checked;
    }

    set value(val) {
        if (typeof val != "boolean")
            this.valueElement.checked = val == "true";
        else
            this.valueElement.checked = val;
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