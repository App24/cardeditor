import { Component } from "../component.mjs";
import { ColorDataType } from "../dataTypes/colorDataType.mjs";
import { RadioButtonDataType } from "../dataTypes/radioButtonDataType.mjs";
import { DropDownDataType } from "../dataTypes/dropdownDataType.mjs";

export class LeaderboardComponent extends Component {
    constructor() {
        super("Leaderboard Settings", "lb", "Settings for the leaderboard card");
        this.dataTypes = [
            new RadioButtonDataType("Background Color", "backgroundColorType", "primaryColor", [
                { name: "Primary Color", value: "primaryColor" },
                { name: "Secondary Color", value: "secondaryColor" },
                { name: "None", value: "none" }
            ], () => this.toggleColor()),
            new ColorDataType("Background Color", "primaryColor", "#363636"),
            new DropDownDataType("Name Type", "nameType", {
                defaultValue: "tag",
                values: [
                    { name: "Tag", value: "tag" },
                    { name: "Nickname", value: "nickname" },
                    { name: "Username", value: "username" }
                ]
            })
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