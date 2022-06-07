import { Component } from "../component.mjs";
import { SliderDataType } from "../dataTypes/sliderDataType.mjs";
import { ColorDataType } from "../dataTypes/colorDataType.mjs";

export class PfpCircleComponent extends Component {
    constructor() {
        super("PFP Circle", "pfpCircle");
        this.dataTypes = [
            new SliderDataType("Circle Size", "width", 10, 3, 15),
            new ColorDataType("Circle Color", "color", "#000000")
        ];
        this.requiredComponents = [{ id: "pfp", validation: () => true }];
    }

    draw(ctx) {
        const size = parseInt(this.values.width);
        const color = this.values.color;

        const pfpRadius = 130 * this.requiredComponents[0].component.values.size;
        const cardPfpX = this.requiredComponents[0].component.subComponents[0].values.positionX - pfpRadius;
        const cardPfpY = this.requiredComponents[0].component.subComponents[0].values.positionY - pfpRadius;

        ctx.save();
        ctx.beginPath();
        ctx.arc(pfpRadius + cardPfpX, pfpRadius + cardPfpY, pfpRadius + size, 0, 360);
        ctx.strokeStyle = color;
        ctx.lineWidth = size * 2;
        ctx.stroke();
        ctx.restore();
    }
}