import { SubComponent } from "../subComponent.mjs";
import { ButtonDataType } from "../dataTypes/buttonDataType.mjs";
import { NumberDataType } from "../dataTypes/numberDataType.mjs";

export class PositionComponent extends SubComponent {
    constructor(defaultX, defaultY) {
        super("Position");
        this.defaultX = defaultX;
        this.defaultY = defaultY;
    }

    createDataTypes() {
        this.dataTypes = [
            new NumberDataType("Position X", `positionX`, this.defaultX),
            new NumberDataType("Position Y", `positionY`, this.defaultY),
            new ButtonDataType("Reset to default", `resetButton`, () => {
                this.dataTypes[0].value = this.defaultX;
                this.dataTypes[1].value = this.defaultY;
            })
        ];
    }
}