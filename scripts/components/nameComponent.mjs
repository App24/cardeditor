import { Component } from "../component.mjs";
import { CheckboxDataType } from "../dataTypes/checkboxDataType.mjs";
import { DropDownDataType } from "../dataTypes/dropdownDataType.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { TextInfoComponent } from "../subComponents/textInfoComponent.mjs";
import { CANVAS_FONT } from "../constants.mjs"
import { getPositionDiff } from "../utils.mjs";

export class NameComponent extends Component {
    constructor() {
        super("Name", "name");
        this.subComponents = [
            new PositionComponent(600, 5),
            new TextInfoComponent("Username", "center", "top", "#ffffff", true, "#000000", { default: 3, min: 0, max: 5 })
        ];
        this.subComponents[1].disableTextSave();
        this.dataTypes = [
            new CheckboxDataType("Match Role Color", "matchRole", true, () => this.toggleTextColor()),
            new DropDownDataType("Name Type", "type", {
                defaultValue: "nickname",
                values: [{ name: "Nickname", value: "nickname" }, { name: "Username", value: "username" }]
            })
        ];
    }

    onLoad() {
        this.toggleTextColor();
    }

    toggleTextColor() {
        if (this.values.matchRole) {
            this.subComponents[1].dataTypes[3].hide();
        } else {
            this.subComponents[1].dataTypes[3].show();
        }
    }

    async draw(ctx) {
        const positionX = this.subComponents[0].values.positionX;
        const positionY = this.subComponents[0].values.positionY;

        const text = this.subComponents[1].values.text;
        const textAlign = this.subComponents[1].values.textAlign;
        const textBaseline = this.subComponents[1].values.textBaseline;

        const textSize = this.subComponents[1].values.textSize;
        const textColor = this.subComponents[1].values.textColor;

        const strokeSize = this.subComponents[1].values.strokeSize;
        const strokeColor = this.subComponents[1].values.strokeColor;

        const matchRole = this.values.matchRole;

        const fontSize = 60 * textSize;

        const font = this.subComponents[1].values.textFont;
        
        const x = parseInt(positionX);
        const y = parseInt(positionY) + getPositionDiff(fontSize, textBaseline);

        ctx.textBaseline = textBaseline;
        ctx.fillStyle = matchRole ? "white" : textColor;
        ctx.font = `${fontSize}px ${font}`;
        ctx.textAlign = textAlign;
        if (strokeSize > 0) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeSize;
            ctx.strokeText(text, x, y);
        }
        ctx.fillText(text, x, y);
    }
}