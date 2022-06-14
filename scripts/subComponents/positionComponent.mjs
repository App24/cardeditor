import { SubComponent } from "../subComponent.mjs";
import { ButtonDataType } from "../dataTypes/buttonDataType.mjs";
import { NumberDataType } from "../dataTypes/numberDataType.mjs";

export class PositionComponent extends SubComponent {
    constructor(defaultX, defaultY, customText = "Position", customId = "position") {
        super(customText);
        this.defaultX = defaultX;
        this.defaultY = defaultY;
        this.customId = customId;
    }

    createDataTypes() {
        this.dataTypes = [
            new NumberDataType(`${this.name} X`, `${this.customId}X`, this.defaultX),
            new NumberDataType(`${this.name} Y`, `${this.customId}Y`, this.defaultY),
            new ButtonDataType("Reset to default", `${this.customId}_resetButton`, () => {
                this.dataTypes[0].value = this.defaultX;
                this.dataTypes[1].value = this.defaultY;
            })
        ];
    }
}