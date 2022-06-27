import { Component } from "../component.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { ScaleComponent } from "../subComponents/scaleComponent.mjs";
import { CheckboxDataType } from "../dataTypes/checkboxDataType.mjs"
import { DropDownDataType } from "../dataTypes/dropdownDataType.mjs";
import { loadImage, drawMaskedImage } from "../utils.mjs";
import { TEMPLATES_FOLDER } from "../constants.mjs"
import { CardTemplateDataType } from "../dataTypes/cardTemplateDataType.mjs";

export class WingsComponent extends Component {
    constructor() {
        super("Wings", "wings");
        this.subComponents = [
            new PositionComponent(600, 260),
            new ScaleComponent("Primary Wings Scale", "wingsAScale"),
            new ScaleComponent("Secondary Wings Scale", "wingsBScale")
        ];
        this.dataTypes = [
            new CheckboxDataType("Follow PFP Image", "followPfp", true, () => this.togglePosition()),
            new CardTemplateDataType("Wings Template", "template"),
            new CheckboxDataType("Auto Resize Primary Wings", "autoSizeWingsA", true, () => this.toggleWingsAScale()),
            new DropDownDataType("Primary Wings Example", "wingsAExample", {
                defaultValue: "example1",
                values: [{ name: "Example 1", value: "example1" }, { name: "Example 2", value: "example2" }]
            }, null, false),
            new CheckboxDataType("Auto Resize Secondary Wings", "autoSizeWingsB", true, () => this.toggleWingsBScale()),
            new DropDownDataType("Seconday Wings Example", "wingsBExample", {
                defaultValue: "example1",
                values: [{ name: "Example 1", value: "example1" }, { name: "Example 2", value: "example2" }]
            }, null, false)
        ];
        this.requiredComponents = [{ id: "pfp", validation: () => this.values.followPfp }];
        this.cache = [{ example: null, wings: null }, { example: null, wings: null }, { image: null, template: null }];
    }

    async getCachedWings() {
        const wingsImages = [];

        if (this.cache[0].example !== this.values.wingsAExample) {
            this.cache[0].example = this.values.wingsAExample;
            this.cache[0].wings = await loadImage(`wings/${this.values.wingsAExample}/aisha.png`);
        }
        if (this.cache[1].example !== this.values.wingsBExample) {
            this.cache[1].example = this.values.wingsBExample;
            this.cache[1].wings = await loadImage(`wings/${this.values.wingsBExample}/aisha.png`);
        }
        wingsImages.push(this.cache[0].wings);
        wingsImages.push(this.cache[1].wings);

        return wingsImages;
    }

    async draw(ctx) {
        const pfpComponent = this.requiredComponents[0].component;

        const wingsTemplatePath = `${TEMPLATES_FOLDER}/${this.values.template}.png`;

        if (this.cache[2].template !== this.values.template) {
            this.cache[2].template = this.values.template;
            this.cache[2].image = await loadImage(wingsTemplatePath);
        }
        const wingsTemplateImage = this.cache[2].image;

        const wingsImages = await this.getCachedWings();

        const pfpX = this.values.followPfp ? pfpComponent.subComponents[0].values.positionX : this.subComponents[0].values.positionX;
        const pfpY = this.values.followPfp ? pfpComponent.subComponents[0].values.positionY : this.subComponents[0].values.positionY;

        const drawWings = (wingsImage, templateImage, autoSize, scaleX, scaleY, globalCompositeOperation) => {
            const wingsWidth = (wingsImage.width * (autoSize ? pfpComponent.values.size : scaleX));
            const wingsHeight = (wingsImage.height * (autoSize ? pfpComponent.values.size : scaleY));

            const wingsX = pfpX - wingsWidth / 2.;
            const wingsY = pfpY - wingsHeight / 2.;

            if (!templateImage) {
                ctx.drawImage(wingsImage, wingsX, wingsY, wingsWidth, wingsHeight);
            }
            else {
                ctx.drawImage(drawMaskedImage(templateImage, wingsImage, globalCompositeOperation), wingsX, wingsY, wingsWidth, wingsHeight);
            }
        };

        if (wingsImages.length >= 2) {
            if (wingsImages[0]) {
                drawWings(wingsImages[0], wingsTemplateImage, this.values.autoSizeWingsA, this.subComponents[1].values.wingsAScaleX, this.subComponents[1].values.wingsAScaleY, "source-in");
            }

            if (wingsImages[1]) {
                drawWings(wingsImages[1], wingsTemplateImage, this.values.autoSizeWingsB, this.subComponents[2].values.wingsBScaleX, this.subComponents[2].values.wingsBScaleY, "source-out");
            }
        } else if (wingsImages[0]) {
            drawWings(wingsImages[0], null, this.values.autoSizeWingsA, this.subComponents[1].values.wingsAScaleX, this.subComponents[1].values.wingsAScaleY, "source-in");
        }
    }

    onLoad() {
        this.togglePosition();
        this.toggleWingsAScale();
        this.toggleWingsBScale();
    }

    togglePosition() {
        if (this.values.followPfp) {
            this.subComponents[0].hide();
        } else {
            this.subComponents[0].show();
        }
    }

    toggleWingsAScale() {
        if (this.values.autoSizeWingsA) {
            this.subComponents[1].hide();
        } else {
            this.subComponents[1].show();
        }
    }

    toggleWingsBScale() {
        if (this.values.autoSizeWingsB) {
            this.subComponents[2].hide();
        } else {
            this.subComponents[2].show();
        }
    }

    async getBoundingRect() {
        const pfpComponent = this.requiredComponents[0].component;

        const pfpX = this.values.followPfp ? pfpComponent.subComponents[0].values.positionX : this.subComponents[0].values.positionX;
        const pfpY = this.values.followPfp ? pfpComponent.subComponents[0].values.positionY : this.subComponents[0].values.positionY;

        const wingsImages = await this.getCachedWings();

        const getWingSize = (wingsImage, autoSize, scaleX, scaleY) => {
            const wingsWidth = (wingsImage.width * (autoSize ? pfpComponent.values.size : scaleX));
            const wingsHeight = (wingsImage.height * (autoSize ? pfpComponent.values.size : scaleY));

            const wingsX = pfpX - wingsWidth / 2.;
            const wingsY = pfpY - wingsHeight / 2.;

            return { left: wingsX, top: wingsY, width: wingsWidth / 2, height: wingsHeight };
        }

        const firstWing = getWingSize(wingsImages[0], this.values.autoSizeWingsA, this.subComponents[1].values.wingsAScaleX, this.subComponents[1].values.wingsAScaleY);
        const secondWing = getWingSize(wingsImages[1], this.values.autoSizeWingsB, this.subComponents[2].values.wingsBScaleX, this.subComponents[2].values.wingsBScaleY);

        const getPosition = () => {
            switch (this.values.template) {
                case "normal": {
                } break;
                default: {
                    firstWing.top = Math.min(firstWing.top, secondWing.top);
                } break;
            }
            return { left: firstWing.left, top: firstWing.top };
        };

        const getSize = () => {

            switch (this.values.template) {
                case "normal": {
                    firstWing.width *= 2;
                } break;
                default: {
                    firstWing.height = Math.max(firstWing.height, secondWing.height);
                    firstWing.width += secondWing.width;
                } break;
            }
            return { width: firstWing.width, height: firstWing.height };
        }

        return Object.assign(getSize(), getPosition());
    }

    get hasPosition() {
        return !this.values.followPfp;
    }

    async setPosition(value) {
        const { x, y, diffX, diffY } = value;

        const wingsImages = await this.getCachedWings();

        const pfpComponent = this.requiredComponents[0].component;

        const pfpX = this.values.followPfp ? pfpComponent.subComponents[0].values.positionX : this.subComponents[0].values.positionX;
        const pfpY = this.values.followPfp ? pfpComponent.subComponents[0].values.positionY : this.subComponents[0].values.positionY;

        const getWingSize = (wingsImage, autoSize, scaleX, scaleY) => {
            const wingsWidth = (wingsImage.width * (autoSize ? pfpComponent.values.size : scaleX));
            const wingsHeight = (wingsImage.height * (autoSize ? pfpComponent.values.size : scaleY));

            const wingsX = pfpX - wingsWidth / 2.;
            const wingsY = pfpY - wingsHeight / 2.;

            return { left: wingsX, top: wingsY, width: wingsWidth / 2, height: wingsHeight };
        }

        const firstWing = getWingSize(wingsImages[0], this.values.autoSizeWingsA, this.subComponents[1].values.wingsAScaleX, this.subComponents[1].values.wingsAScaleY);
        const secondWing = getWingSize(wingsImages[1], this.values.autoSizeWingsB, this.subComponents[2].values.wingsBScaleX, this.subComponents[2].values.wingsBScaleY);

        switch (this.values.template) {
            case "normal": {
            } break;
            default: {
                firstWing.height = Math.max(firstWing.height, secondWing.height);
            } break;
        }

        const xPos = x + firstWing.width - diffX;
        const yPos = y + firstWing.height / 2 - diffY;

        this.subComponents[0].dataTypes[0].value = xPos;
        this.subComponents[0].dataTypes[1].value = yPos;
    }
}