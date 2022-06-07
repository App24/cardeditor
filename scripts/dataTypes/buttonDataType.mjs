import { DataType } from "../DataType.mjs";

export class ButtonDataType extends DataType {
    constructor(label, name, callbackFn) {
        super(label, name, "", callbackFn, false);
    }

    createHTML(componentId, callbackFn) {
        this.componentId = componentId;

        const div = document.createElement("div");

        div.id = `${this.componentId}_${this.name}_div`;

        const input = document.createElement("input");
        input.type = "button";
        input.id = `${this.componentId}_${this.name}`;
        input.value = this.label;
        input.dataset.nosave = "";

        input.addEventListener("click", () => this.callbackFn());

        input.addEventListener("click", () => callbackFn());

        div.appendChild(input);

        return div;
    }

    get valueElement() {
        return document.getElementById(`${this.componentId}_${this.name}`);
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