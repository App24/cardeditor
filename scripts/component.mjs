export class Component {
    constructor(name, componentId) {
        this.subComponents = [];
        this.parentComponent = undefined;
        this.id = 0;
        this.componentId = componentId;
        this.name = name;
        this.dataTypes = [];
        this.parentElement = undefined;
        this.requiredComponents = [];
    }

    get values() {
        const data = {};
        this.dataTypes.forEach(dataType => {
            data[dataType.name] = dataType.value;
        });
        return data;
    }

    draw(ctx) {
    }

    onLoad() {

    }

    toggle() {
        if (this.parentElement.hidden) {
            this.show();
        } else {
            this.hide();
        }
    }

    hide() {
        this.parentElement.hidden = true;
    }

    show() {
        this.parentElement.hidden = false;
    }
}