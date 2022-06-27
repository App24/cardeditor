import { Component } from "../component.mjs";
import { ColorDataType } from "../dataTypes/colorDataType.mjs";
import { DropDownDataType } from "../dataTypes/dropdownDataType.mjs";
import { SliderDataType } from "../dataTypes/sliderDataType.mjs";
import { CARD_HEIGHT, CARD_WIDTH, TEMPLATES_FOLDER } from "../constants.mjs";
import { roundRect, loadImage, createCanvas, drawMaskedImage } from "../utils.mjs";
import { CardTemplateDataType } from "../dataTypes/cardTemplateDataType.mjs";

export class BackgroundComponent extends Component {
    constructor() {
        super("Background", "background");
        this.dataTypes = [
            new ColorDataType("Primary Color", "primaryColor", "#363636"),
            new ColorDataType("Seconday Color", "secondaryColor", "#363636"),
            new CardTemplateDataType("Card Template", "template"),
            new SliderDataType("Roundness", "round", 1, 0, 5, 0.1)
        ];
    }

    async draw(ctx) {
        const roundness = this.values.round / 100;

        const cardTemplatePath = `${TEMPLATES_FOLDER}/${this.values.template}.png`;

        const cardTemplateImage = await loadImage(cardTemplatePath);

        if (cardTemplateImage) {
            const tempCanvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
            const tempCtx = tempCanvas.getContext("2d");

            tempCtx.fillStyle = this.values.primaryColor;
            roundRect(tempCtx, 0, 0, CARD_WIDTH, CARD_HEIGHT, CARD_WIDTH * roundness);

            ctx.drawImage(drawMaskedImage(cardTemplateImage, tempCanvas, "source-in"), 0, 0);

            tempCtx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

            tempCtx.fillStyle = this.values.secondaryColor;
            roundRect(tempCtx, 0, 0, CARD_WIDTH, CARD_HEIGHT, CARD_WIDTH * roundness);

            ctx.drawImage(drawMaskedImage(cardTemplateImage, tempCanvas, "source-out"), 0, 0);

            tempCanvas.remove();
        } else {
            ctx.fillStyle = this.values.primaryColor;
            roundRect(ctx, 0, 0, CARD_WIDTH, CARD_HEIGHT, CARD_WIDTH * roundness);
        }
    }

    getBoundingRect() {
        return { left: 0, top: 0, width: CARD_WIDTH, height: CARD_HEIGHT };
    }
}