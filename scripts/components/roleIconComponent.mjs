import { Component } from "../component.mjs";
import { CheckboxDataType } from "../dataTypes/checkboxDataType.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { ScaleComponent } from "../subComponents/scaleComponent.mjs";

export class RoleIconComponent extends Component {
    constructor() {
        super("Role Icon", "roleIcon");
        this.subComponents = [
            new PositionComponent(0, 0),
            new ScaleComponent()
        ];
        this.dataTypes = [
            new CheckboxDataType("Autosize", "autoSize", true, () => this.toggleSize())
        ];
    }

    onLoad() {
        this.toggleSize();
    }

    toggleSize() {
        if (this.values.autoSize) {
            this.subComponents[1].hide();
        } else {
            this.subComponents[1].show();
        }
    }

    draw(ctx) {
        const sizeX = 128 * (this.values.autoSize ? 1 : this.subComponents[1].values.scaleX);
        const sizeY = 128 * (this.values.autoSize ? 1 : this.subComponents[1].values.scaleY);

        const positionX = this.subComponents[0].values.positionX;
        const positionY = this.subComponents[0].values.positionY;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(positionX, positionY, sizeX, sizeY);
    }
}