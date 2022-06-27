import { DropDownDataType } from "./dropdownDataType.mjs";

export class CardTemplateDataType extends DropDownDataType {
    constructor(label, name) {
        super(label, name, {
            defaultValue: "normal",
            values: [{ name: "Normal", value: "normal" },
            { name: "Split", value: "split" },
            { name: "Vertical Split", value: "verticalSplit" },
            { name: "Gradient", value: "gradient" },
            { name: "Vertical Gradient", value: "verticalGradient" },
            { name: "Central Gradient", value: "centralGradient" },
            { name: "Vertical Central Gradient", value: "verticalCentralGradient" },
            { name: "Radial Gradient", value: "radialGradient" }]
        });
    }
}