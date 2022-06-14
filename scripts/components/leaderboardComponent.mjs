import { Component } from "../component.mjs";
import { ColorDataType } from "../dataTypes/colorDataType.mjs";
import { RadioButtonDataType } from "../dataTypes/radioButtonDataType.mjs";

export class LeaderboardComponent extends Component {
    constructor() {
        super("Leaderboard Settings", "lb");
        this.dataTypes = [
            new RadioButtonDataType("Background Color", "backgroundColorType", "primaryColor", [
                { name: "Primary Color", value: "primaryColor" },
                { name: "Secondary Color", value: "secondaryColor" },
                { name: "None", value: "none" }
            ], () => this.toggleColor()),
            new ColorDataType("Background Color", "primaryColor", "#363636")
        ];
    }

    onLoad() {
        this.toggleColor();
    }

    toggleColor() {
        if (this.values.backgroundColorType != "none") {
            this.dataTypes[1].hide();
        } else {
            this.dataTypes[1].show();
        }
    }
}