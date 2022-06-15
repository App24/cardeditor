export class Snackbar {
    constructor(message) {
        this.message = message;
        this._createSnackbar();
    }

    _createSnackbar() {
        const oldSnack = document.getElementById("snackbar");
        if (oldSnack) oldSnack.remove();
        const div = document.createElement("div");
        div.id = "snackbar";
        div.classList.add("show");

        div.innerText = this.message;

        setTimeout(() => {
            div.classList.remove("show");
            setTimeout(() => {
                div.remove();
            }, 500);
        }, 3000);

        document.body.appendChild(div);
    }

    static createSnackbar(message) {
        new Snackbar(message);
    }
}