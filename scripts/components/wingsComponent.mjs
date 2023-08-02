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
            new ScaleComponent("Wings Scale", "wingsAScale"),
        ];
        this.dataTypes = [
            new CheckboxDataType("Follow PFP Image", "followPfp", true, () => this.togglePosition()),
            new CheckboxDataType("Auto Resize Wings", "autoSizeWingsA", true, () => this.toggleWingsAScale()),
            new DropDownDataType("Wings Example", "wingsAExample", {
                defaultValue: "example1",
                values: [{ name: "Example 1", value: "example1" }, { name: "Example 2", value: "example2" }]
            }, null, false),
        ];
        this.requiredComponents = [{ id: "pfp", validation: () => this.values.followPfp }];
        this.cache = [{ example: null, wings: null }];
    }

    async getCachedWings() {
        const wingsImages = [];

        if (this.cache[0].example !== this.values.wingsAExample) {
            this.cache[0].example = this.values.wingsAExample;
            this.cache[0].wings = await loadImage(`wings/${this.values.wingsAExample}/aisha.png`);
        }
        wingsImages.push(this.cache[0].wings);

        return wingsImages;
    }

    async draw(ctx) {
        const pfpComponent = this.requiredComponents[0].component;

        const wingsImages = await this.getCachedWings();

        const pfpX = this.values.followPfp ? pfpComponent.subComponents[0].values.positionX : this.subComponents[0].values.positionX;
        const pfpY = this.values.followPfp ? pfpComponent.subComponents[0].values.positionY : this.subComponents[0].values.positionY;

        const drawWings = (wingsImage, autoSize, scaleX, scaleY) => {
            const wingsWidth = (wingsImage.width * (autoSize ? pfpComponent.values.size : scaleX));
            const wingsHeight = (wingsImage.height * (autoSize ? pfpComponent.values.size : scaleY));

            const wingsX = pfpX - wingsWidth / 2.;
            const wingsY = pfpY - wingsHeight / 2.;

            ctx.drawImage(wingsImage, wingsX, wingsY, wingsWidth, wingsHeight);
        };

        drawWings(wingsImages[0], this.values.autoSizeWingsA, this.subComponents[1].values.wingsAScaleX, this.subComponents[1].values.wingsAScaleY);
    }

    onLoad() {
        this.togglePosition();
        this.toggleWingsAScale();
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

        const getPosition = () => {
            return { left: firstWing.left, top: firstWing.top };
        };

        const getSize = () => {

            firstWing.width *= 2;
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

        const xPos = x + firstWing.width - diffX;
        const yPos = y + firstWing.height / 2 - diffY;

        this.subComponents[0].dataTypes[0].value = xPos;
        this.subComponents[0].dataTypes[1].value = yPos;
    }
}