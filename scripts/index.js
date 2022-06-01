const canvasWidth = 1200;
const canvasHeight = 600;

const defaultCardColor = "#363636";

const TEMPLATES_FOLDER = "templates";

const CANVAS_FONT = "Comic Sans MS";

const MAX_LAYERS = 6;

String.prototype.removeHash = function () {
    if (this.startsWith("#")) {
        return this.substring(1, this.length);
    }
    return this;
}

const draggings = {};
let currentId = 0;

let currentMouseX = 0;
let currentMouseY = 0;

document.onmousedown = (e) => {
    currentMouseX = e.clientX;
    currentMouseY = e.clientY;
}

document.onmousemove = (e) => {
    const dragging = document.getElementsByClassName("dragging");
    for (const drag of dragging) {
        drag.style.left = e.clientX;
        drag.style.top = e.clientY;
    }
}

document.onmouseup = (e) => {
    const dragging = document.getElementsByClassName("dragging");
    for (const drag of dragging) {
        draggings[drag.querySelector(".draggable").id].down = false;
        drag.classList.remove("dragging");
        let draggedOver = document.elementFromPoint(e.clientX, e.clientY);
        draggedOver = draggedOver.parentElement ?? draggedOver;
        drag.style.left = null;
        drag.style.top = null;
        if (!draggedOver.classList.contains("layer-menu")) {
            const draggable = drag.querySelector(".draggable");
            const oldParent = draggings[draggable.id].oldParent;
            oldParent.appendChild(drag);
            openMenu(oldParent);
        } else {
            const content = draggedOver.querySelector(".content");
            content.appendChild(drag);

            const requiredComponents = getRequiredComponents(drag);
            const dependantComponents = getDependantComponents(drag);

            requiredComponents.forEach(requiredComponent => {
                const component = document.getElementsByClassName(`component-${requiredComponent}`)[0];
                const layer = getLayer(component);
                if (layer < 0)
                    content.appendChild(component);
            });

            if (dependantComponents.length > 0) {
                const component = document.getElementsByClassName(`component-${dependantComponents[0]}`)[0];
                const otherContent = getLayerMenu(getLayer(component)).querySelector(".content");
                otherContent.appendChild(drag);
                openMenu(otherContent);
            } else {
                openMenu(draggedOver);
            }
        }
        const layer = getLayer(drag);
        if (layer < 0) continue;

        updateLayer(layer);
    }
}

window.onload = async () => {
    {
        const layers = document.querySelector("layers");
        for (let i = 0; i < MAX_LAYERS; i++) {
            const menu = document.createElement("div");
            menu.classList.add("menu", "layer-menu");
            menu.dataset["layer"] = i;

            const label = document.createElement("div");
            label.classList.add("label");
            label.innerHTML = `Layer ${i + 1}`;
            menu.appendChild(label);

            const content = document.createElement("div");
            content.classList.add("content", "hidden");
            menu.appendChild(content);

            layers.appendChild(menu);
        }

        const checkboxes = document.createElement("div");
        const fieldset = document.createElement("fieldset");
        const legend = document.createElement("legend");
        legend.innerHTML = "Visible Layers";
        fieldset.appendChild(legend);

        for (let i = 0; i < MAX_LAYERS; i++) {
            const div = document.createElement("div");
            const input = document.createElement("input");
            input.type = "checkbox";
            input.checked = true;
            input.name = `layer${i}`;
            input.classList.add("layerCheckbox");
            input.addEventListener("change", () => changeVisibleLayers());

            div.appendChild(input);

            const label = document.createElement("label");
            label.htmlFor = `layer${i}`;
            label.innerHTML = `Layer ${i + 1}`;
            div.appendChild(label);

            fieldset.appendChild(div);
        }
        checkboxes.appendChild(fieldset);
        layers.appendChild(checkboxes);
    }

    {
        const cardCanvas = document.getElementById("cardCanvas");
        for (let i = 0; i < MAX_LAYERS; i++) {
            const canvas = document.createElement("canvas");
            canvas.classList.add("layerCanvas");
            cardCanvas.appendChild(canvas);
        }
    }

    await loadComponents();

    {
        const canvases = document.getElementsByClassName("layerCanvas");
        for (const canvas of canvases) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
        }
    }

    {
        const updateCards = document.getElementsByClassName("updateCard");
        for (const updateCard of updateCards) {
            updateCard.addEventListener("change", () => updateLayerElement(updateCard));
            updateCard.addEventListener("input", () => updateLayerElement(updateCard));
            if (updateCard.getAttribute("type") === "button") {
                updateCard.addEventListener("click", () => updateLayerElement(updateCard));
            }
        }
    }

    {
        const selectMenus = document.getElementsByClassName("menu");
        for (const selectMenu of selectMenus) {
            const label = selectMenu.querySelector(".label");
            label.setAttribute("onclick", "toggleMenu(this)");
        }
    }

    {
        const draggables = document.getElementsByClassName("draggable");
        for (const draggable of draggables) {
            if (!draggable.id) {
                draggable.id = `id_${currentId++}`;
            }

            draggings[draggable.id] = { drag: false, down: false };
            draggable.addEventListener("mousedown", () => {
                draggings[draggable.id] = {
                    drag: false, down: true,
                    previousMouseX: currentMouseX,
                    previousMouseY: currentMouseY
                };
            });

            draggable.addEventListener("mousemove", () => {
                const dragging = draggings[draggable.id];
                if (dragging.down) {
                    const diffX = currentMouseX - dragging.previousMouseX;
                    const diffY = currentMouseY - dragging.previousMouseY;
                    const distance = Math.sqrt((diffX * diffX) + (diffY * diffY));

                    if (!dragging.drag && distance > 20) {
                        const layer = getLayer(draggable);
                        dragging.drag = true;
                        dragging.oldParent = draggable.parentElement.parentElement;
                        const oldMenu = draggable.parentElement;
                        draggable.parentElement.classList.add("dragging");
                        document.getElementById("dragging-heaven").appendChild(draggable.parentElement);
                        collapseMenu(oldMenu);
                        if (isMenuEmpty(dragging.oldParent)) {
                            collapseMenu(dragging.oldParent);
                        } else {
                            openMenu(dragging.oldParent);
                        }
                        if (layer >= 0)
                            updateLayer(layer);
                    }
                }
            });
            draggable.addEventListener("mouseup", () => {
                draggings[draggable.id].down = false;
                draggings[draggable.id].drag = false;
            });
        }
    }

    {
        const menus = document.querySelectorAll(".menu");
        menus.forEach(menu => {
            const label = menu.querySelector(".label");
            const svg = document.createElement("svg");
            svg.id = "dropdown";
            const use = document.createElement("use");
            use.setAttribute("href", "#closed");
            svg.appendChild(use);
            label.innerHTML = svg.outerHTML + label.innerHTML;
        });
    }

    {
        const draggables = document.getElementsByClassName("draggable");
        for (const draggable of draggables) {
            const svg = document.createElement("svg");
            const use = document.createElement("use");
            use.setAttribute("href", "#draggable");
            svg.appendChild(use);
            draggable.innerHTML = svg.outerHTML + draggable.innerHTML;
        }
    }

    {
        const code = localStorage.getItem("cardCode");
        if (code != null) {
            loadCode(code);
        }
        getLayerMenus().forEach(layer => {
            collapseMenu(layer);
        });
    }

    changeVisibleLayers();
    for (let index = 0; index < MAX_LAYERS; index++) {
        updateLayer(index);
    }
}

function changeVisibleLayers() {
    const canvases = document.getElementsByClassName("layerCanvas");
    const layerCheckboxes = document.getElementsByClassName("layerCheckbox");
    for (let index = 0; index < canvases.length; index++) {
        const element = canvases[index];
        const checkBox = layerCheckboxes[index];
        if (checkBox.checked) {
            element.classList.remove("hidden");
        } else {
            element.classList.add("hidden");
        }
    }
}

function roundRect(ctx, x, y, width, height, radius, func = "fill") {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    switch (func) {
        case "clip":
            ctx.clip();
            break;
        case "fill":
            ctx.fill();
            break;
        case "stroke":
            ctx.stroke();
            break;
    }
}

function drawMaskedImage(mask, image, globalCompositeOperation) {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(mask, 0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = globalCompositeOperation;

    ctx.drawImage(image, 0, 0);

    return canvas;
}

function checkIfFileExists(url) {
    try {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status != 404;
    } catch {
        return false;
    }
}

async function getImageFromBlob(blob) {
    return new Promise((resolve) => {
        const image = new Image();

        image.onload = () => {
            resolve(image);
        }

        image.src = URL.createObjectURL(blob);
    });
}

function createCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function getCanvas(layer) {
    const canvases = document.getElementsByClassName("layerCanvas");
    if (layer < 0 || layer >= canvases.length)
        return undefined;
    return canvases[layer];
}

function getLayer(element) {
    let currentElement = element;
    while (currentElement && currentElement.dataset.layer == undefined) {
        currentElement = currentElement.parentElement;
    }
    if (!currentElement) {
        return -1;
    }
    return currentElement.dataset.layer ?? -1;
}

function updateLayerElement(element) {
    const layer = getLayer(element);
    if (layer < 0) return;
    updateLayer(layer);
}

async function updateLayer(layer) {
    if (layer < 0) return;
    const container = getLayerMenu(layer).querySelector(".content");
    const updateFuncs = container.querySelectorAll("[data-updatefunc]");
    const canvas = getCanvas(layer);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    await asyncForEach(updateFuncs, async (updateFuncElement) => {
        await updateComponent(layer, updateFuncElement);
    });
}

async function updateComponent(layer, updateFuncElement) {
    const updateFuncString = getUpdateFunc(updateFuncElement);
    if (!updateFuncString) return;
    const updateFunc = window[updateFuncString];
    if (!updateFunc) return;
    const values = updateFuncElement.querySelector(".content").querySelectorAll(".updateCard");
    const data = {};
    for (let index = 0; index < values.length; index++) {
        const value = values[index];
        if (value.id) {
            switch (value.getAttribute("type")) {
                case "checkbox":
                    data[value.id] = value.checked;
                    break;
                case "file":
                    data[value.id] = value.files[0];
                    break;
                default:
                    data[value.id] = value.value;
                    break;
            }
        }
    }
    await updateFunc(getCanvas(layer), data);
    const optionalComponents = getOptionalComponents(updateFuncElement);
    await asyncForEach(optionalComponents, async (component) => {
        const componentLayer = getLayer(document.getElementsByClassName(`component-${component}`)[0]);
        if (componentLayer < 0 || componentLayer == layer) return;
        await updateLayer(componentLayer);
    });
}

function getUpdateFunc(element) {
    let currentElement = element;
    while (currentElement && currentElement.dataset.updatefunc == undefined) {
        currentElement = currentElement.parentElement;
    }
    if (!currentElement) {
        return;
    }
    return currentElement.dataset.updatefunc;
}

function getOptionalComponents(element) {
    let currentElement = element;
    while (currentElement && currentElement.dataset.optionalcomponent == undefined) {
        currentElement = currentElement.parentElement;
    }
    if (!currentElement || !currentElement.dataset.optionalcomponent) {
        return [];
    }
    return currentElement.dataset.optionalcomponent.split(" ");
}

function getRequiredComponents(element) {
    let currentElement = element;
    while (currentElement && currentElement.dataset.requiredcomponent == undefined) {
        currentElement = currentElement.parentElement;
    }
    if (!currentElement || !currentElement.dataset.requiredcomponent) {
        return [];
    }
    return currentElement.dataset.requiredcomponent.split(" ");
}

function getDependantComponents(element) {
    const requiredComponents = document.querySelectorAll(`[data-requiredcomponent]`);
    const toReturn = [];

    if (requiredComponents) {
        requiredComponents.forEach(comp => {
            comp.dataset.requiredcomponent.split(" ").forEach(c => {
                if (c === element.dataset.componenttype) {
                    if (getLayer(comp) >= 0)
                        toReturn.push(comp.dataset.componenttype);
                }
            });
        });
    }

    return toReturn;
}

async function loadImage(path) {
    if (!checkIfFileExists(path)) return;

    const blob = await fetch(path).then(res => res.blob());
    return getImageFromBlob(blob);
}

async function asyncForEach(array, callbackFn) {
    for (let i = 0; i < array.length; i++) {
        const exit = await callbackFn(array[i], i, array);
        if (exit === true) return true;
    }
    return false;
}

function fitTextOnCanvas(ctx, text, width, startSize = 100) {
    let fontsize = startSize;

    const prevFont = ctx.font;

    ctx.font = `${fontsize}px ${CANVAS_FONT}`;

    do {
        fontsize--;
        ctx.font = `${fontsize}px ${CANVAS_FONT}`;
    } while (ctx.measureText(text).width > width);

    ctx.font = prevFont;

    return fontsize;

}

function hexToRGB(hex) {
    const result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(color) {
    return ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
}

function blend(a, b, w) {
    return (a * w) + (b * (1 - w));
}

function blendRGB(colorA, colorB, w) {
    return {
        r: blend(colorA.r, colorB.r, w),
        g: blend(colorA.g, colorB.g, w),
        b: blend(colorA.b, colorB.b, w)
    };
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return {
        h,
        s,
        l
    };
}