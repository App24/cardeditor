import { DataType } from "../DataType.mjs";

export class FileDataType extends DataType {
    constructor(label, name) {
        super(label, name, "", null, false);
    }

    createHTML(componentId, callbackFn) {
        this.componentId = componentId;

        const div = document.createElement("div");

        div.id = `${this.componentId}_${this.name}_div`;

        const input = document.createElement("input");
        input.type = "file";
        input.id = `${this.componentId}_${this.name}`;
        input.accept = ".jpg,.jpeg,.png";
        input.dataset.nosave = "";

        const label = document.createElement("label");
        label.htmlFor = this.name;
        label.textContent = `${this.label}*: `;

        input.addEventListener("change", () => callbackFn());
        input.addEventListener("input", () => callbackFn());

        div.appendChild(label);
        div.appendChild(input);

        return div;
    }

    get valueElement(){
        return document.getElementById(`${this.componentId}_${this.name}`);
    }

    get value() {
        return this.valueElement.files[0];
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

    show() {
        this.parentElement.hidden = false;
    }

    hide() {
        this.parentElement.hidden = true;
    }
}