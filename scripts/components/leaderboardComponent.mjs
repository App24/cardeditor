import { Component } from "../component.mjs";
import { CheckboxDataType } from "../dataTypes/checkboxDataType.mjs";
import { ColorDataType } from "../dataTypes/colorDataType.mjs";

export class LeaderboardComponent extends Component {
    constructor() {
        super("Leaderboard", "lb");
        this.dataTypes = [
            new CheckboxDataType("Follow Backgroud Primary Color", "followBackgroundColor", true, () => this.toggleColor()),
            new ColorDataType("Background Color", "primaryColor", "#363636")
        ];
    }

    onLoad() {
        this.toggleColor();
    }

    toggleColor() {
        if (this.values.followBackgroundColor) {
            this.dataTypes[1].hide();
        } else {
            this.dataTypes[1].show();
        }
    }
}