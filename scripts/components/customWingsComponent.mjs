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
    }

    async draw(ctx) {
        if (this.values.wingsImage !== undefined) {
            const wingsImage = await getImageFromBlob(this.values.wingsImage);
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
}