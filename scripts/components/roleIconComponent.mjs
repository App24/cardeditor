import { Component } from "../component.mjs";
import { CheckboxDataType } from "../dataTypes/checkboxDataType.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";

export class RoleIconComponent extends Component {
    constructor() {
        super("Role Icon", "roleIcon");
        this.subComponents = [
            new PositionComponent(0, 0),
            new PositionComponent(128, 128, "Size", "size")
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
        const sizeX = this.values.autoSize ? 128 : this.subComponents[1].values.sizeX;
        const sizeY = this.values.autoSize ? 128 : this.subComponents[1].values.sizeY;

        const positionX = this.subComponents[0].values.positionX;
        const positionY = this.subComponents[0].values.positionY;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(positionX, positionY, sizeX, sizeY);
    }
}