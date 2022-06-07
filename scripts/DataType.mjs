export class DataType {
    constructor(label, name, defaultValue, callbackFn, save = true) {
        this.label = label;
        this.name = name;
        this.defaultValue = defaultValue;
        this.callbackFn = callbackFn;
        this.save = save;
    }

    createHTML(componentId, callbackFn) { }

    get parentElement() { }

    get valueElement() { }

    toggle() { }
    hide() { }
    show() { }

    set value(val) { }
    get value() { }
}
