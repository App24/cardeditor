export class Menu {
    constructor(label, draggable = false) {
        this.menu = document.createElement("div");
        this.label = document.createElement("div");
        this.content = document.createElement("div");

        this.parentMenu = undefined;

        this.menu.classList.add("menu");
        this.label.classList.add("label");
        this.content.classList.add("content");

        this.label.innerText = label;

        const svg = document.createElement("svg");
        svg.id = "dropdown";
        const use = document.createElement("use");
        use.setAttribute("href", "#closed");
        svg.appendChild(use);
        this.label.innerHTML = svg.outerHTML + this.label.innerHTML;

        if (draggable) {
            const svg = document.createElement("svg");
            const use = document.createElement("use");
            use.setAttribute("href", "#draggable");
            svg.appendChild(use);
            this.label.innerHTML = svg.outerHTML + this.label.innerHTML;
        }

        this.dropdownSvg = this.label.querySelector("#dropdown").querySelector("use");

        this.menu.appendChild(this.label);
        this.menu.appendChild(this.content);

        this.label.addEventListener("click", () => this._toggleMenu());
    }

    isEmpty() {
        return this.content.childElementCount <= 0;
    }

    closeMenu() {
        this.content.hidden = true;
        this._updateIcon();
        this._checkClass();
    }

    openMenu() {
        if (!this.isEmpty()) {
            this.dropdownSvg.setAttribute("href", "#opened");
            this.content.hidden = false;
        }
        this._checkClass();
    }

    addContent(element) {
        if (element instanceof Menu) {
            element.parentMenu = this;
            this.content.append(element.menu);
        } else
            this.content.appendChild(element);
        this._updateIcon();
    }

    _updateIcon() {
        if (this.content.hidden) {
            this.dropdownSvg.setAttribute("href", this.isEmpty() ? "#closedGreyout" : "#closed");
        }
    }

    _checkClass(){
        if (this.isEmpty()) {
            this.label.classList.remove("openableMenu");
            this.label.classList.add("emptyMenu");
        } else {
            this.label.classList.remove("emptyMenu");
            this.label.classList.add("openableMenu");
        }
    }

    _toggleMenu() {
        if (this.content.hidden) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }
}