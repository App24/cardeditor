import { Component } from "../component.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { TextInfoComponent } from "../subComponents/textInfoComponent.mjs";
import { CANVAS_FONT } from "../constants.mjs"
import { getPositionDiff } from "../utils.mjs";

export class RankComponent extends Component {
    constructor() {
        super("Leaderboard Text", "rank");
        this.subComponents = [
            new PositionComponent(1190, 5),
            new TextInfoComponent("0", "right", "top", "#ffffff", true, "#000000", { default: 0, min: 0, max: 5 })
        ]
        this.subComponents[1].disableTextSave();
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

        const fontSize = 50 * textSize;

        const lbPositionText = `Rank: #${text}`;

        const x = parseInt(positionX);
        const y = parseInt(positionY) + getPositionDiff(fontSize, textBaseline);

        ctx.textBaseline = textBaseline;
        ctx.fillStyle = textColor;
        ctx.font = `${fontSize}px ${CANVAS_FONT}`;
        ctx.textAlign = textAlign;
        if (strokeSize > 0) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeSize;
            ctx.strokeText(lbPositionText, x, y);
        }
        ctx.fillText(lbPositionText, x, y);
    }
}