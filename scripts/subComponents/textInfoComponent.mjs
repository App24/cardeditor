import { SubComponent } from "../subComponent.mjs";
import { DropDownDataType } from "../dataTypes/dropdownDataType.mjs";
import { FontDataType } from "../dataTypes/fontDataType.mjs";
import { ColorDataType } from "../dataTypes/colorDataType.mjs";
import { SliderDataType } from "../dataTypes/sliderDataType.mjs";
import { TextDataType } from "../dataTypes/textDataType.mjs"
import { ButtonDataType } from "../dataTypes/buttonDataType.mjs";

export class TextInfoComponent extends SubComponent {
    constructor(defaultText, defaultTextAlign, defaultTextBaseline, defaultTextColor, hasTextSize, defaultStrokeColor, strokeData) {
        super("Text Info");
        this.defaultText = defaultText;
        this.defaultTextAlign = defaultTextAlign;
        this.defaultTextBaseline = defaultTextBaseline;
        this.defaultTextColor = defaultTextColor;
        this.hasTextSize = hasTextSize;
        this.defaultStrokeColor = defaultStrokeColor;
        this.strokeData = strokeData;
        this.saveText = true;
    }

    disableTextSave() {
        this.saveText = false;
    }

    createDataTypes() {
        this.dataTypes = [
            new TextDataType("Text", `text`, this.defaultText, this.saveText),
            new FontDataType("Font", "textFont", {
                defaultValue: "Comic Sans MS",
                values: [
                    { value: "Comic Sans MS" },
                    { value: "Helvetica" },
                    // { value: "Bodoni MT" },
                    { value: "Garamond" },
                    { value: "Georgia" },
                    { value: "Courier New" },
                    { value: "Copperplate Gothic Light" },
                    // { value: "Brush Script MT" },
                    // { value: "Papyrus" },
                ]
            }),
            new DropDownDataType("Text Alignment", `textAlign`, {
                defaultValue: this.defaultTextAlign,
                values: [{ name: "Left", value: "left" },
                { name: "Center", value: "center" },
                { name: "Right", value: "right" }]
            }),
            new DropDownDataType("Text Baseline", `textBaseline`, {
                defaultValue: this.defaultTextBaseline,
                values: [{ name: "Top", value: "top" },
                { name: "Hanging", value: "hanging" },
                { name: "Middle", value: "middle" },
                { name: "Alphabetic", value: "alphabetic" },
                { name: "Ideographic", value: "ideographic" },
                { name: "Bottom", value: "bottom" }]
            }),
            new ColorDataType("Text Color", `textColor`, this.defaultTextColor),
        ];
        if (this.hasTextSize) {
            this.dataTypes = [...this.dataTypes,
            new SliderDataType("Text Size", `textSize`, 1, 0.5, 1.5, 0.1)
            ]
        }
        this.dataTypes = [...this.dataTypes,
        new ColorDataType("Stroke Color", `strokeColor`, this.defaultStrokeColor),
        new SliderDataType("Stroke Size", `strokeSize`, this.strokeData.default, this.strokeData.min, this.strokeData.max, this.strokeData.step ?? 1),
        new ButtonDataType("Reset to default", `textInfo_resetButton`, () => {
            let i = 0;
            this.dataTypes[i++].value = this.defaultText;
            this.dataTypes[i++].value = this.defaultTextAlign;
            this.dataTypes[i++].value = this.defaultTextBaseline;
            this.dataTypes[i++].value = this.defaultTextColor;
            if (this.hasTextSize)
                this.dataTypes[i++].value = 1;
            this.dataTypes[i++].value = this.defaultStrokeColor;
            this.dataTypes[i++].value = this.strokeData.default;
        })
        ]
    }
}