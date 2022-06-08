import { Component } from "../component.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { ScaleComponent } from "../subComponents/scaleComponent.mjs";
import { CheckboxDataType } from "../dataTypes/checkboxDataType.mjs"
import { DropDownDataType } from "../dataTypes/dropdownDataType.mjs";
import { FileDataType } from "../dataTypes/fileDataType.mjs";
import { loadImage, drawMaskedImage, getImageFromBlob } from "../utils.mjs";
import { TEMPLATES_FOLDER } from "../constants.mjs"

export class WingsComponent extends Component {
    constructor() {
        super("Wings", "wings");
        this.subComponents = [
            new PositionComponent(600, 260),
            new ScaleComponent()
        ];
        this.dataTypes = [
            new CheckboxDataType("Follow PFP Image", "followPfp", true, () => this.togglePosition()),
            new CheckboxDataType("Auto Resize", "autoSize", true, () => this.toggleScale()),
            new DropDownDataType("Wings Template", "template", {
                defaultValue: "normal",
                values: [{ name: "Normal", value: "normal" },
                { name: "Split", value: "split" },
                { name: "Gradient", value: "gradient" },
                { name: "Central Gradient", value: "centralGradient" },
                { name: "Radial Gradient", value: "radialGradient" }]
            }
            ),
            new DropDownDataType("Wings Type", "type", {
                defaultValue: "default",
                values: [{ name: "Default", value: "default" }, { name: "Custom", value: "custom" }]
            }, () => this.toggleCustomWings()),
            new FileDataType("Wings Image", "wingsImage"),
            new DropDownDataType("Primary Wings Example", "wingsAExample", {
                defaultValue: "example1",
                values: [{ name: "Example 1", value: "example1" }, { name: "Example 2", value: "example2" }]
            }, null, false),
            new DropDownDataType("Seconday Wings Example", "wingsBExample", {
                defaultValue: "example1",
                values: [{ name: "Example 1", value: "example1" }, { name: "Example 2", value: "example2" }]
            }, null, false)
        ];
        this.requiredComponents = [{ id: "pfp", validation: () => this.values.followPfp }];
    }

    async draw(ctx) {
        const pfpComponent = this.requiredComponents[0].component;

        const wingsTemplatePath = `${TEMPLATES_FOLDER}/${this.values.template}.png`;

        const wingsTemplateImage = await loadImage(wingsTemplatePath);

        const wingsImages = [];

        if (this.values.type === "default") {
            wingsImages.push(await loadImage(`wings/${this.values.wingsAExample}/aisha.png`));
            wingsImages.push(await loadImage(`wings/${this.values.wingsBExample}/tecna.png`));
        } else {
            if (this.values.wingsImage !== undefined) {
                wingsImages.push(await getImageFromBlob(this.values.wingsImage));
                wingsImages.push(await getImageFromBlob(this.values.wingsImage));
            } else {
                wingsImages.push(undefined);
                wingsImages.push(undefined);
            }
        }

        const pfpX = this.values.followPfp ? pfpComponent.subComponents[0].values.positionX : this.subComponents[0].values.positionX;
        const pfpY = this.values.followPfp ? pfpComponent.subComponents[0].values.positionY : this.subComponents[0].values.positionY;

        const drawWings = (wingsImage, templateImage, globalCompositeOperation) => {
            const wingsWidth = (wingsImage.width * (this.values.autoSize ? pfpComponent.values.size : this.subComponents[1].values.scaleX));
            const wingsHeight = (wingsImage.height * (this.values.autoSize ? pfpComponent.values.size : this.subComponents[1].values.scaleY));

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
                drawWings(wingsImages[0], wingsTemplateImage, "source-in");
            }

            if (wingsImages[1]) {
                drawWings(wingsImages[1], wingsTemplateImage, "source-out");
            }
        } else if (wingsImages[0]) {
            drawWings(wingsImages[0], null, "source-in");
        }
    }

    onLoad() {
        this.togglePosition();
        this.toggleScale();
        this.toggleCustomWings();
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

    toggleCustomWings() {
        if (this.values.type == "custom") {
            this.dataTypes[4].show();
            this.dataTypes[5].hide();
            this.dataTypes[6].hide();
        } else {
            this.dataTypes[4].hide();
            this.dataTypes[5].show();
            this.dataTypes[6].show();
        }
    }
}