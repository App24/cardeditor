import { Component } from "../component.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { TextInfoComponent } from "../subComponents/textInfoComponent.mjs";
import { CheckboxDataType } from "../dataTypes/checkboxDataType.mjs";
import { CANVAS_FONT } from "../constants.mjs"
import { getPositionDiff } from "../utils.mjs";

export class XpComponent extends Component {
    constructor() {
        super("XP Text", "xp");
        this.subComponents = [
            new PositionComponent(100, 62),
            new PositionComponent(100, 57, "Offset", "offset"),
            new TextInfoComponent("0/0", "center", "top", "#ffffff", true, "#000000", { default: 0, min: 0, max: 5 })
        ];
        this.subComponents[2].disableTextSave();
        this.dataTypes = [
            new CheckboxDataType("Center in middle of levels text", "middleLevel", true, () => this.togglePosition()),
            new CheckboxDataType("Auto Offset", "autoOffset", true, () => this.toggleOffset())
        ];
        this.requiredComponents = [{ id: "levels", validation: () => this.centerText() }];
    }

    togglePosition() {
        if (this.values.middleLevel) {
            this.subComponents[0].hide();
            this.dataTypes[1].show();
            this.toggleOffset();
        } else {
            this.subComponents[0].show();
            this.dataTypes[1].hide();
            this.subComponents[1].hide();
        }
    }

    toggleOffset(){
        if(this.values.autoOffset){
            this.subComponents[1].hide();
        }else{
            this.subComponents[1].show();
        }
    }

    onLoad() {
        this.subComponents[1].parentElement.children[1].remove();
        this.subComponents[1].dataTypes.shift();
        this.togglePosition();
        this.toggleOffset();
    }

    centerText() {
        return this.dataTypes[0].value;
    }

    draw(ctx) {
        const positionX = this.subComponents[0].values.positionX;
        const positionY = this.subComponents[0].values.positionY;

        const text = this.subComponents[2].values.text;

        const textAlign = this.subComponents[2].values.textAlign;
        const textBaseline = this.subComponents[2].values.textBaseline;

        const textColor = this.subComponents[2].values.textColor;
        const textSize = this.subComponents[2].values.textSize;

        const strokeColor = this.subComponents[2].values.strokeColor;
        const strokeSize = this.subComponents[2].values.strokeSize;

        let x = parseInt(positionX);
        let y = parseInt(positionY);

        if (this.centerText()) {
            const fontSize = 50 * this.requiredComponents[0].component.subComponents[1].values.textSize;

            const levelsText = `Level: ${this.requiredComponents[0].component.subComponents[1].values.text}`;

            ctx.font = `${fontSize}px ${CANVAS_FONT}`;
            ctx.textBaseline = this.requiredComponents[0].component.subComponents[1].values.textBaseline;
            ctx.textAlign = this.requiredComponents[0].component.subComponents[1].values.textAlign;

            const metrics = ctx.measureText(levelsText);
            const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

            x = parseInt(this.requiredComponents[0].component.subComponents[0].values.positionX) + (metrics.width / 2.);
            y = parseInt(this.requiredComponents[0].component.subComponents[0].values.positionY);
            if (this.values.autoOffset) {
                y += (actualHeight * 1.4);
            } else {
                y += parseInt(this.subComponents[1].values.offsetY);
            }
        }

        const xpFontSize = 33.33333333333333 * textSize;

        y += getPositionDiff(xpFontSize, textBaseline);

        ctx.font = `${xpFontSize}px ${CANVAS_FONT}`;
        ctx.fillStyle = textColor;
        ctx.textBaseline = textBaseline;
        ctx.textAlign = textAlign;
        if (strokeSize > 0) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeSize;
            ctx.strokeText(text, x, y);
        }
        ctx.fillText(text, x, y);
    }
}