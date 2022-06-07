import { Component } from "../component.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { CheckboxDataType } from "../dataTypes/checkboxDataType.mjs"
import { DropDownDataType } from "../dataTypes/dropdownDataType.mjs";
import { FileDataType } from "../dataTypes/fileDataType.mjs";
import { loadImage, drawMaskedImage, getImageFromBlob } from "../utils.mjs";
import { TEMPLATES_FOLDER } from "../constants.mjs"

export class WingsComponent extends Component {
    constructor() {
        super("Wings", "wings");
        this.subComponents = [
            new PositionComponent(600, 260)
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
        const wingsTemplatePath = `${TEMPLATES_FOLDER}/${this.values.template}.png`;

        const wingsTemplateImage = await loadImage(wingsTemplatePath);

        const wingsImages = [];

        if(this.values.type==="default"){
        wingsImages.push(await loadImage(`wings/${this.values.wingsAExample}/aisha.png`));
        wingsImages.push(await loadImage(`wings/${this.values.wingsBExample}/tecna.png`));
        }else{
            if (this.values.wingsImage !== undefined) {
                wingsImages.push(await getImageFromBlob(this.values.wingsImage));
                wingsImages.push(await getImageFromBlob(this.values.wingsImage));
            } else {
                wingsImages.push(undefined);
                wingsImages.push(undefined);
            }
        }

        const pfpX = this.values.followPfp ? this.requiredComponents[0].component.subComponents[0].values.positionX : this.subComponents[0].values.positionX;
        const pfpY = this.values.followPfp ? this.requiredComponents[0].component.subComponents[0].values.positionY : this.subComponents[0].values.positionY;

        const drawWings = (wingsImage, templateImage, globalCompositeOperation) => {
            const wingsX = pfpX - wingsImage.width / 2.;
            // const wingsY = ((pfpRadius + (canvasHeight / 2.3) - pfpRadius) - wingsImage.height / 2.);
            const wingsY = pfpY - wingsImage.height / 2.;
    
            if (!templateImage) {
                ctx.drawImage(wingsImage, wingsX, wingsY);
            }
            else {
                ctx.drawImage(drawMaskedImage(templateImage, wingsImage, globalCompositeOperation), wingsX, wingsY);
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
        this.toggleCustomWings();
    }

    togglePosition() {
        if (this.values.followPfp) {
            this.subComponents[0].hide();
        } else {
            this.subComponents[0].show();
        }
    }

    toggleCustomWings() {
        if (this.values.type == "custom") {
            this.dataTypes[3].show();
        } else {
            this.dataTypes[3].hide();
        }
    }
}