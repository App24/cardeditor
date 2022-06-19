import { TextComponent } from "./textComponent.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { TextInfoComponent } from "../subComponents/textInfoComponent.mjs";
import { CANVAS_FONT, CARD_WIDTH } from "../constants.mjs"
import { getPositionDiff, fitTextOnCanvas } from "../utils.mjs";

export class NextTransformationComponent extends TextComponent {
    constructor() {
        super("Next Transformation Text", "nextTransformation", (ctx, text) => fitTextOnCanvas(ctx, text, CARD_WIDTH),
        {
            defaultX: 600, defaultY: 600,
            defaultText: "None", defaultTextAlign: "center", defaultTextBaseline: "bottom",
            defaultTextColor: "#ffffff", hasTextSize: false,
            defaultStrokeColor: "#000000",
            strokeData: {
                default: 0,
                min: 0,
                max: 5
            }
        });
        // this.subComponents = [
        //     new PositionComponent(600, 600),
        //     new TextInfoComponent("None", "center", "bottom", "#ffffff", false, "#000000", { default: 0, min: 0, max: 5 })
        // ]
        this.subComponents[1].disableTextSave();
    }

    customDraw(ctx, data) {
        data.text = `Next Transformation: ${data.text}`;
    }

    // draw(ctx) {
    //     const positionX = this.subComponents[0].values.positionX;
    //     const positionY = this.subComponents[0].values.positionY;

    //     const text = this.subComponents[1].values.text;
    //     const textAlign = this.subComponents[1].values.textAlign;
    //     const textBaseline = this.subComponents[1].values.textBaseline;

    //     const textColor = this.subComponents[1].values.textColor;

    //     const strokeSize = this.subComponents[1].values.strokeSize;
    //     const strokeColor = this.subComponents[1].values.strokeColor;

    //     const font = this.subComponents[1].values.textFont;

    //     const currentRankText = `Next Transformation: ${text}`;

    //     const fontSize = fitTextOnCanvas(ctx, currentRankText, CARD_WIDTH);

    //     const x = parseInt(positionX);
    //     const y = parseInt(positionY) + getPositionDiff(fontSize, textBaseline, font);

    //     ctx.font = `${fontSize}px ${font}`;
    //     ctx.textBaseline = textBaseline;
    //     ctx.fillStyle = textColor;
    //     ctx.textAlign = textAlign;
    //     if (strokeSize > 0) {
    //         ctx.strokeStyle = strokeColor;
    //         ctx.lineWidth = strokeSize;
    //         ctx.strokeText(currentRankText, x, y);
    //     }
    //     ctx.fillText(currentRankText, x, y);
    // }
}