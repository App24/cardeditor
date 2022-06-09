import { Component } from "../component.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs"
import { TextInfoComponent } from "../subComponents/textInfoComponent.mjs";
import { CANVAS_FONT } from "../constants.mjs"
import { getPositionDiff } from "../utils.mjs";

export class LevelsComponent extends Component {
    constructor() {
        super("Level Text", "levels");
        this.subComponents = [
            new PositionComponent(10, 5),
            new TextInfoComponent("0", "left", "top", "#ffffff", true, "#000000", { default: 0, min: 0, max: 5 })
        ];
        this.subComponents[1].disableTextSave();
    }

    draw(ctx) {
        const positionX = this.subComponents[0].values.positionX;
        const positionY = this.subComponents[0].values.positionY;

        const text = this.subComponents[1].values.text;
        const textAlign = this.subComponents[1].values.textAlign;
        const textBaseline = this.subComponents[1].values.textBaseline;

        const textColor = this.subComponents[1].values.textColor;
        const textSize = this.subComponents[1].values.textSize;

        const strokeColor = this.subComponents[1].values.strokeColor;
        const strokeSize = this.subComponents[1].values.strokeSize;

        const font = this.subComponents[1].values.textFont;

        const fontSize = 50 * textSize;

        const x = parseInt(positionX);
        const y = parseInt(positionY) + getPositionDiff(fontSize, textBaseline, font);

        const levelsText = `Level: ${text}`;

        ctx.textBaseline = textBaseline;
        ctx.fillStyle = textColor;
        ctx.font = `${fontSize}px ${font}`;
        ctx.textAlign = textAlign;
        if (strokeSize > 0) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeSize;
            ctx.strokeText(levelsText, x, y);
        }
        ctx.fillText(levelsText, x, y);
    }
}