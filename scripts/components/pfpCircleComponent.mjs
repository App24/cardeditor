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
        const pfpComponent = this.requiredComponents[0].component;

        const size = parseInt(this.values.width);
        const color = this.values.color;

        const pfpRadius = 130 * pfpComponent.values.size;
        const cardPfpX = pfpComponent.subComponents[0].values.positionX - pfpRadius;
        const cardPfpY = pfpComponent.subComponents[0].values.positionY - pfpRadius;

        ctx.save();
        ctx.beginPath();
        ctx.arc(pfpRadius + cardPfpX, pfpRadius + cardPfpY, pfpRadius + size, 0, 360);
        ctx.strokeStyle = color;
        ctx.lineWidth = size * 2;
        ctx.stroke();
        ctx.restore();
    }

    getBoundingRect() {
        const pfpComponent = this.requiredComponents[0].component;

        const size = parseInt(this.values.width);

        const pfpRadius = 130 * pfpComponent.values.size;
        const cardPfpX = pfpComponent.subComponents[0].values.positionX - pfpRadius;
        const cardPfpY = pfpComponent.subComponents[0].values.positionY - pfpRadius;

        return { left: cardPfpX - size * 2, top: cardPfpY - size * 2, width: (pfpRadius + size * 2) * 2, height: (pfpRadius + size * 2) * 2 };
    }
}