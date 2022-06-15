import { Component } from "../component.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { ScaleComponent } from "../subComponents/scaleComponent.mjs";
import { CheckboxDataType } from "../dataTypes/checkboxDataType.mjs"
import { DropDownDataType } from "../dataTypes/dropdownDataType.mjs";
import { loadImage, drawMaskedImage } from "../utils.mjs";
import { TEMPLATES_FOLDER } from "../constants.mjs"

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
            new DropDownDataType("Wings Template", "template", {
                defaultValue: "normal",
                values: [{ name: "Normal", value: "normal" },
                { name: "Split", value: "split" },
                { name: "Gradient", value: "gradient" },
                { name: "Central Gradient", value: "centralGradient" },
                { name: "Radial Gradient", value: "radialGradient" }]
            }
            ),
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
    }

    async draw(ctx) {
        const pfpComponent = this.requiredComponents[0].component;

        const wingsTemplatePath = `${TEMPLATES_FOLDER}/${this.values.template}.png`;

        const wingsTemplateImage = await loadImage(wingsTemplatePath);

        const wingsImages = [];

        wingsImages.push(await loadImage(`wings/${this.values.wingsAExample}/aisha.png`));
        wingsImages.push(await loadImage(`wings/${this.values.wingsBExample}/tecna.png`));

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
}