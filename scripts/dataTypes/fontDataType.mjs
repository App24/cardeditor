import { DropDownDataType } from "./dropdownDataType.mjs";

export class FontDataType extends DropDownDataType {
    constructor(label, name, data, callbackFn = () => undefined, save = true) {
        super(label, name, { defaultValue: data.defaultValue.replaceAll(" ", "_"), values: data.values.map(v => { return { name: v.value, value: v.value.replaceAll(" ", "_") }; }) }, callbackFn, save);
    }

    get value() {
        return super.value.replaceAll("_", " ");
    }

    set value(val) {
        super.value = val.replaceAll(" ", "_");
    }
}