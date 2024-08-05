export class Component {
    constructor(name, componentId, description) {
        this.subComponents = [];
        this.parentComponent = undefined;
        this.id = 0;
        this.componentId = componentId;
        this.name = name;
        this.dataTypes = [];
        this.parentElement = undefined;
        this.requiredComponents = [];
        this.description = description;
        this.drawBoundingRect = false;
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

    getBoundingRect(ctx) { }

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

    get hasPosition() {
        return false;
    }

    setPosition(value) { }
    
    get subLayer(){
        const parent = this.parentElement;
        return Array.prototype.indexOf.call(parent.parentElement.children, parent);
    }

    get layer(){
        return this.parentElement.parentElement.parentElement.dataset.layer;
    }
}