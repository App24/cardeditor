import { SubComponent } from "../subComponent.mjs";
import { SliderDataType } from "../dataTypes/sliderDataType.mjs";
import { ButtonDataType } from "../dataTypes/buttonDataType.mjs";

export class ScaleComponent extends SubComponent{
    constructor() {
        super("Scale");
    }

    createDataTypes(){
        this.dataTypes=[
            new SliderDataType("Scale X", "scaleX", 1, 0.5, 1.5, 0.1),
            new SliderDataType("Scale Y", "scaleY", 1, 0.5, 1.5, 0.1),
            new ButtonDataType("Reset to default", `resetButton`, () => {
                this.dataTypes[0].value = 1;
                this.dataTypes[1].value = 1;
            })
        ];
    }
}