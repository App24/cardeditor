import { Component } from "../component.mjs";
import { SliderDataType } from "../dataTypes/sliderDataType.mjs";
import { TextDataType } from "../dataTypes/textDataType.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { loadImage } from "../utils.mjs";

export class PfpComponent extends Component {
    constructor() {
        super("Profile Image", "pfp");
        this.subComponents = [
            new PositionComponent(600, 260)
        ];
        this.dataTypes = [
            new TextDataType("Profile Image", "image", "https://cdn.discordapp.com/embed/avatars/0.png", false),
            new SliderDataType("Size", "size", 1, 0.5, 1.5, 0.1)
        ];
    }

    async draw(ctx) {
        let image = this.values.image;
        const size = this.values.size;
        const positionX = this.subComponents[0].values.positionX;
        const positionY = this.subComponents[0].values.positionY;

        if (image.endsWith(".gif")) {
            image = image.substring(0, pfpImage.length - 3);
            image += "png";
        }

        const userAvatar = await loadImage(image);

        if (userAvatar) {

            const pfpRadius = 130 * size;
            const cardPfpX = positionX - pfpRadius;
            const cardPfpY = positionY - pfpRadius;

            ctx.save();
            ctx.beginPath();
            ctx.arc(pfpRadius + cardPfpX, pfpRadius + cardPfpY, pfpRadius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(userAvatar, cardPfpX, cardPfpY, pfpRadius * 2, pfpRadius * 2);
            ctx.restore();
        }
    }
}