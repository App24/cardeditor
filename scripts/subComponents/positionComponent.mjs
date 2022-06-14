import { SubComponent } from "../subComponent.mjs";
import { ButtonDataType } from "../dataTypes/buttonDataType.mjs";
import { NumberDataType } from "../dataTypes/numberDataType.mjs";

export class PositionComponent extends SubComponent {
    constructor(defaultX, defaultY, customText = "Position", customId = "position", removeX = false) {
        super(customText);
        this.removeX = removeX;
        if (!removeX)
            this.defaultX = defaultX;
        this.defaultY = defaultY;
        this.customId = customId;
    }

    createDataTypes() {
        if (!this.removeX)
            this.dataTypes = [
                new NumberDataType(`${this.name} X`, `${this.customId}X`, this.defaultX)
            ];
        this.dataTypes = [
            ...this.dataTypes,
            new NumberDataType(`${this.name} Y`, `${this.customId}Y`, this.defaultY),
            new ButtonDataType("Reset to default", `${this.customId}_resetButton`, () => {
                let i = 0;
                if (!this.removeX)
                    this.dataTypes[i++].value = this.defaultX;
                this.dataTypes[i++].value = this.defaultY;
            })
        ];
    }
}