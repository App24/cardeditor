import { Component } from "../component.mjs";
import { PositionComponent } from "../subComponents/positionComponent.mjs";
import { DropDownDataType } from "../dataTypes/dropdownDataType.mjs";
import { ColorDataType } from "../dataTypes/colorDataType.mjs";
import { SliderDataType } from "../dataTypes/sliderDataType.mjs";
import { hexToRGB, blend, rgbToHsl, roundRect } from "../utils.mjs";

export class XpBarComponent extends Component {
    constructor() {
        super("XP Bar", "xpBar");
        this.subComponents = [
            new PositionComponent(600, 500)
        ];
        this.dataTypes = [
            new DropDownDataType("Type", "type", {
                defaultValue: "circle",
                values: [{ name: "Circle", value: "circle", }, { name: "Bar", value: "bar" }]
            }, () => this.toggleTypes()),
            new ColorDataType("Start Color", "startColor", "#cc0000"),
            new ColorDataType("End Color", "endColor", "#44cc00"),
            new ColorDataType("Bar Color", "barColor", "#272822"),
            new SliderDataType("Bar Size", "width", 10, 3, 15),
            new SliderDataType("Bar Width", "size", 1, 0.5, 1.5, 0.1),
            new SliderDataType("Bar Height", "height", 1, 0.5, 1.5, 0.1),
            new SliderDataType("Roundness", "round", 1, 0, 5, 0.1),
            new DropDownDataType("Align", "barAlign", {
                defaultValue: "left",
                values: [{ name: "Left", value: "left" },
                { name: "Center", value: "center" },
                { name: "Right", value: "right" }]
            }),
            new SliderDataType("Bar Filled", "filled", 0, 0, 1, 0.01, false)
        ];
        this.requiredComponents = [{ id: "pfp", validation: () => this.dataTypes[0].value === "circle" }];
    }

    draw(ctx) {
        let positionX = parseInt(this.subComponents[0].values.positionX);
        let positionY = parseInt(this.subComponents[0].values.positionY);

        const startRGB = hexToRGB(this.values.startColor);
        const startHsl = rgbToHsl(startRGB.r, startRGB.g, startRGB.b);

        const endRGB = hexToRGB(this.values.endColor);
        const endHsl = rgbToHsl(endRGB.r, endRGB.g, endRGB.b);

        const filled = this.values.filled;

        switch (this.values.type) {
            default:
            case "circle": {
                const size = parseInt(this.values.width);

                const pfpRadius = 130 * this.requiredComponents[0].component.values.size;
                const cardPfpX = this.requiredComponents[0].component.subComponents[0].values.positionX - pfpRadius;
                const cardPfpY = this.requiredComponents[0].component.subComponents[0].values.positionY - pfpRadius;

                positionX = pfpRadius + cardPfpX;
                positionY = pfpRadius + cardPfpY;

                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = `hsla(${blend(startHsl.h, endHsl.h, 1 - filled) * 360}, ${blend(startHsl.s, endHsl.s, 1 - filled) * 100}%, ${blend(startHsl.l, endHsl.l, 1 - filled) * 100}%, 1)`;
                ctx.lineWidth = size * 2;
                ctx.arc(positionX, positionY, pfpRadius + size, (Math.PI / 180) * 270, (Math.PI / 180) * (270 + (360 * filled)));
                ctx.stroke();
                ctx.restore();
            } break;
            case "bar": {
                const round = this.values.round / 10;

                const barWidth = 600 * this.values.size;
                const barHeight = 30 * this.values.height;

                positionX = positionX - barWidth / 2;
                positionY = positionY - barHeight / 2;

                let filledBarX = positionX;
                let filledBarY = positionY;
    
                switch (this.values.barAlign) {
                    case "center": {
                        filledBarX += (barWidth / 2) - (barWidth * filled) / 2;
                    } break;
                    case "right": {
                        filledBarX += (barWidth) - (barWidth * filled);
                    } break;
                }
    
                ctx.fillStyle = this.values.barColor;
                ctx.save();
                roundRect(ctx, positionX, positionY, barWidth, barHeight, barHeight * round);
                ctx.restore();
    
                ctx.fillStyle = `hsla(${blend(startHsl.h, endHsl.h, 1 - filled) * 360}, ${blend(startHsl.s, endHsl.s, 1 - filled) * 100}%, ${blend(startHsl.l, endHsl.l, 1 - filled) * 100}%, 1)`;
                ctx.save();
                roundRect(ctx, filledBarX, filledBarY, barWidth * filled, barHeight, barHeight * round, "clip");
                ctx.fillRect(filledBarX, filledBarY, barWidth * filled, barHeight);
                ctx.restore();

            } break;
            // case "bar": {
            //     xpBar_round /= 10;

            //     const barWidth = 600 * xpBar_size;
            //     const barHeight = 30 * xpBar_height;

            //     xpBar_positionX = xpBar_positionX - barWidth / 2;
            //     xpBar_positionY = xpBar_positionY - barHeight / 2;

            //     let filledBarX = xpBar_positionX;
            //     let filledBarY = xpBar_positionY;

            //     switch (xpBar_bar_align) {
            //         case "center": {
            //             filledBarX += (barWidth / 2) - (barWidth * filled) / 2;
            //         } break;
            //         case "right": {
            //             filledBarX += (barWidth) - (barWidth * filled);
            //         } break;
            //     }

            //     ctx.fillStyle = xpBar_barColor;
            //     ctx.save();
            //     roundRect(ctx, xpBar_positionX, xpBar_positionY, barWidth, barHeight, barHeight * xpBar_round);
            //     ctx.restore();

            //     ctx.fillStyle = `hsla(${blend(startHsl.h, endHsl.h, 1 - filled) * 360}, ${blend(startHsl.s, endHsl.s, 1 - filled) * 100}%, ${blend(startHsl.l, endHsl.l, 1 - filled) * 100}%, 1)`;
            //     ctx.save();
            //     roundRect(ctx, filledBarX, filledBarY, barWidth * filled, barHeight, barHeight * xpBar_round, "clip");
            //     ctx.fillRect(filledBarX, filledBarY, barWidth * filled, barHeight);
            //     ctx.restore();
            // } break;
        }
    }

    onLoad() {
        this.toggleTypes();
    }

    toggleTypes() {
        switch (this.dataTypes[0].value) {
            case "circle": {
                this.subComponents[0].hide();
                this.dataTypes[3].hide();
                this.dataTypes[4].show();
                this.dataTypes[5].hide();
                this.dataTypes[6].hide();
                this.dataTypes[7].hide();
                this.dataTypes[8].hide();
            } break;
            case "bar": {
                this.subComponents[0].show();
                this.dataTypes[3].show();
                this.dataTypes[4].hide();
                this.dataTypes[5].show();
                this.dataTypes[6].show();
                this.dataTypes[7].show();
                this.dataTypes[8].show();
            } break;
        }
    }
}