import { SubComponent } from "../subComponent.mjs";
import { SliderDataType } from "../dataTypes/sliderDataType.mjs";
import { ButtonDataType } from "../dataTypes/buttonDataType.mjs";

export class ScaleComponent extends SubComponent {
    constructor(customName = "Scale", customId = "scale") {
        super(customName);
        this.customId = customId;
    }

    createDataTypes() {
        this.dataTypes = [
            new SliderDataType(`${this.name} X`, `${this.customId}X`, 1, 0.5, 1.5, 0.1),
            new SliderDataType(`${this.name} Y`, `${this.customId}Y`, 1, 0.5, 1.5, 0.1),
            new ButtonDataType("Reset to default", `${this.customId}_resetButton`, () => {
                this.dataTypes[0].value = 1;
                this.dataTypes[1].value = 1;
            })
        ];
    }
}