import { DataType } from "../DataType.mjs";

export class DropDownDataType extends DataType {
    constructor(label, name, data, callbackFn = () => undefined, save = true) {
        super(label, name, data.defaultValue, callbackFn, save);
        this.values = data.values;
    }

    createHTML(componentId, callbackFn) {
        this.componentId = componentId;

        const div = document.createElement("div");

        div.id = `${this.componentId}_${this.name}_div`;

        const input = document.createElement("select");
        input.id = `${this.componentId}_${this.name}`;
        input.name = this.name;

        this.values.forEach(value => {
            const option = document.createElement("option");
            option.id = `${input.id}_${value.value}`;
            option.value = value.value;
            if (option.value === this.defaultValue) {
                option.selected = true;
            }
            option.innerText = value.name;
            input.appendChild(option);
        });

        if (!this.values.some(value => {
            const option = input.querySelector(`#${input.id}_${value.value}`);
            return option.selected;
        })) {
            input.querySelector(`${input.id}_${this.values[0].value}`).selected = true;
        }

        const label = document.createElement("label");
        label.htmlFor = this.name;
        label.textContent = `${this.label}: `;
        
        if (!this.save) {
            input.dataset.nosave = "";
            label.textContent = `${this.label}*: `;
        }

        input.addEventListener("change", () => this.callbackFn());

        input.addEventListener("change", () => callbackFn());

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

    get valueElement(){
        return document.getElementById(`${this.componentId}_${this.name}`);
    }

    get value() {
        return this.valueElement.value;
    }

    set value(val) {
        this.values.forEach(value => {
            const option = document.getElementById(`${this.componentId}_${this.name}_${value.value}`);
            if (option.value === val) {
                option.selected = true;
            }
        });
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