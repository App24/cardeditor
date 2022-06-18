import { Component } from "../component.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { ScaleComponent } from "../subComponents/scaleComponent.mjs";
import { FileDataType } from "../dataTypes/fileDataType.mjs";
import { getImageFromBlob } from "../utils.mjs";

export class CustomWingsComponent extends Component {
    constructor() {
        super("Custom Wings", "customWings");
        this.subComponents = [
            new PositionComponent(600, 300),
            new ScaleComponent(),
        ];
        this.dataTypes = [
            new FileDataType("Wings Image", "wingsImage"),
        ];
        this.cache = { blob: null, image: null };
    }

    async draw(ctx) {
        if (this.values.wingsImage !== undefined) {
            if (this.cache.blob !== this.values.wingsImage) {
                this.cache.image = await getImageFromBlob(this.values.wingsImage);
                this.cache.blob = this.values.wingsImage;
            }
            const wingsImage = this.cache.image;
            if (wingsImage) {
                const scaleX = this.subComponents[1].values.scaleX;
                const scaleY = this.subComponents[1].values.scaleY;

                const pfpX = this.subComponents[0].values.positionX;
                const pfpY = this.subComponents[0].values.positionY;

                const wingsWidth = (wingsImage.width * scaleX);
                const wingsHeight = (wingsImage.height * scaleY);

                const wingsX = pfpX - wingsWidth / 2.;
                const wingsY = pfpY - wingsHeight / 2.;

                ctx.drawImage(wingsImage, wingsX, wingsY, wingsWidth, wingsHeight);
            }
        }
    }

    onLoad() {
        this.togglePosition();
        this.toggleScale();
    }

    togglePosition() {
        if (this.values.followPfp) {
            this.subComponents[0].hide();
        } else {
            this.subComponents[0].show();
        }
    }

    toggleScale() {
        if (this.values.autoSize) {
            this.subComponents[1].hide();
        } else {
            this.subComponents[1].show();
        }
    }

    async getBoundingRect() {
        const positionX = this.subComponents[0].values.positionX;
        const positionY = this.subComponents[0].values.positionY;

        if (this.values.wingsImage === undefined) {
            return { left: positionX, top: positionY, width: 0, height: 0 };
        }

        if (this.cache.blob !== this.values.wingsImage) {
            this.cache.image = await getImageFromBlob(this.values.wingsImage);
            this.cache.blob = this.values.wingsImage;
        }
        const wingsImage = this.cache.image;
        if (!wingsImage) {
            return { left: positionX, top: positionY, width: 0, height: 0 };
        }

        const scaleX = this.subComponents[1].values.scaleX;
        const scaleY = this.subComponents[1].values.scaleY;

        const width = wingsImage.width * scaleX;
        const height = wingsImage.height * scaleY;

        return { left: positionX - width / 2, top: positionY - height / 2, width, height };
    }

    get hasPosition() {
        return this.values.wingsImage !== undefined;
    }

    async setPosition(value) {
        const { x, y, diffX, diffY } = value;

        if (this.cache.blob !== this.values.wingsImage) {
            this.cache.image = await getImageFromBlob(this.values.wingsImage);
            this.cache.blob = this.values.wingsImage;
        }
        const wingsImage = this.cache.image;

        const scaleX = this.subComponents[1].values.scaleX;
        const scaleY = this.subComponents[1].values.scaleY;

        const width = wingsImage.width * scaleX;
        const height = wingsImage.height * scaleY;

        this.subComponents[0].dataTypes[0].value = x + (width / 2 - diffX);
        this.subComponents[0].dataTypes[1].value = y + (height / 2 - diffY);
    }
}