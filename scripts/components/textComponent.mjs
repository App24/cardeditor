import { Component } from "../component.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { TextInfoComponent } from "../subComponents/textInfoComponent.mjs";
import { getPositionDiff } from "../utils.mjs";

export class TextComponent extends Component {
    constructor(name, componentId, fontSize, data, description) {
        super(name, componentId, description);
        this.subComponents = [
            new PositionComponent(data.defaultX, data.defaultY),
            new TextInfoComponent(data.defaultText, data.defaultTextAlign, data.defaultTestBaseline, data.defaultTextColor, data.hasTextSize, data.defaultStrokeColor, data.strokeData)
        ];
        this.fontSize = typeof fontSize === "function" ? fontSize : () => fontSize;
        // this.drawBoundingRect = true;
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

        const font = this.subComponents[1].values.textFont;

        const data = { text };

        ctx.textBaseline = textBaseline;
        ctx.fillStyle = textColor;
        ctx.textAlign = textAlign;
        this.customDraw(ctx, data);
        const fontSize = this.fontSize(ctx, data.text) * (this.subComponents[1].hasTextSize ? textSize : 1);
        ctx.font = `${fontSize}px ${font}`;

        const x = parseInt(positionX);
        const y = parseInt(positionY) + getPositionDiff(fontSize, textBaseline, font);

        if (strokeSize > 0) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeSize;
            ctx.strokeText(data.text, x, y);
        }
        ctx.fillText(data.text, x, y);
    }

    customDraw(ctx, data) {

    }

    getBoundingRect(ctx) {
        const positionX = this.subComponents[0].values.positionX;
        const positionY = this.subComponents[0].values.positionY;

        const text = this.subComponents[1].values.text;
        const textAlign = this.subComponents[1].values.textAlign;
        const textBaseline = this.subComponents[1].values.textBaseline;

        const textSize = this.subComponents[1].values.textSize;
        const textColor = this.subComponents[1].values.textColor;

        const matchRole = this.values.matchRole;

        const font = this.subComponents[1].values.textFont;

        const data = { text };

        ctx.textBaseline = textBaseline;
        ctx.fillStyle = matchRole ? "white" : textColor;
        ctx.textAlign = textAlign;
        this.customDraw(ctx, data);
        const fontSize = this.fontSize(ctx, data.text) * (this.subComponents[1].hasTextSize ? textSize : 1);
        ctx.font = `${fontSize}px ${font}`;

        const x = parseInt(positionX);
        const y = parseInt(positionY) + getPositionDiff(fontSize, textBaseline, font);


        const metrics = ctx.measureText(data.text);
        const actualHeight = metrics.actualBoundingBoxDescent + metrics.actualBoundingBoxAscent;

        const getPosition = () => {
            let xPos = x;
            let yPos = y;
            switch (textAlign) {
                case "center": {
                    xPos -= metrics.width / 2;
                } break;
                case "right": {
                    xPos -= metrics.width;
                } break;
            }
            yPos -= metrics.actualBoundingBoxAscent;
            return { left: xPos, top: yPos };
        }

        return Object.assign({ width: metrics.width, height: actualHeight }, getPosition());
    }
}