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
            draggings[drag.querySelector(".draggable").id].oldParent.appendChild(drag);
            draggings[drag.querySelector(".draggable").id].oldParent.classList.remove("hidden");
            draggings[drag.querySelector(".draggable").id].oldParent.parentElement.querySelector(".label").querySelector("#dropdown").children[0].setAttribute("href", "#opened");
        } else {
            const content = draggedOver.querySelector(".content");
            content.appendChild(drag);
            content.classList.remove("hidden");
            draggedOver.querySelector(".label").querySelector("#dropdown").children[0].setAttribute("href", "#opened");

            const requiredComponents = getRequiredComponents(drag);

            requiredComponents.forEach(requiredComponent => {
                const component = document.getElementsByClassName(`component-${requiredComponent}`)[0];
                const layer = getLayer(component);
                if (layer < 0)
                    content.appendChild(component);
            });
        }
        const layer = getLayer(drag);
        if (layer < 0) continue;

        updateLayer(layer);
    }
}

let currentComponentId = 0;

async function loadComponents(i = 0) {
    const components = document.querySelectorAll("[data-component]");
    if (!components || !components.length) return;
    await asyncForEach(components, async (component) => {
        const file = component.dataset.component;
        if (!file) return;
        await new Promise((resolve, error) => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = async function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        if (component.dataset.noscript == null) {
                            const script = document.createElement("script");
                            script.src = `components/scripts/${file}Component.js`;
                            document.head.appendChild(script);
                        }
                        let text = this.responseText;

                        const replaceText = (key, value) => {
                            const searchMask = `%${key}%`;
                            const regExp = new RegExp(searchMask, "ig");
                            text = text.replace(regExp, value);
                        };

                        for (const data in component.dataset) {
                            replaceText(data, component.dataset[data]);
                        }

                        replaceText("id", currentComponentId);

                        component.innerHTML = text;
                        component.children.item(0).classList.add(`component-${file}`);
                        component.children.item(0).dataset.componenttype = component.dataset.component;

                        if (i) {
                            component.children.item(0).dataset.subcomponent = "true";
                        }

                        delete component.dataset.component;
                        {
                            const scriptText = component.querySelector("script");
                            if (scriptText) {
                                const script = document.createElement("script");
                                script.innerText = scriptText.innerText;
                                document.head.appendChild(script);
                                const init_func = window[`comp_${currentComponentId}_init`];
                                if (init_func && typeof init_func === "function") {
                                    await init_func(component);
                                }
                                scriptText.remove();
                            }
                        }
                        currentComponentId++;
                        resolve();
                    }
                    if (this.status === 404) {
                        error();
                    }
                }
            };
            xhttp.open("GET", `components/${file}Component.html`, true);
            xhttp.send();
        }).catch(() => undefined);
    });
    await loadComponents(++i);
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
                        if (draggable.parentElement.classList.contains("menu")) {
                            draggable.parentElement.querySelector(".content").classList.add("hidden");
                            draggable.parentElement.querySelector(".label").querySelector("#dropdown").children[0].setAttribute("href", "#closed");
                        }
                        draggable.parentElement.classList.add("dragging");
                        document.getElementById("dragging-heaven").appendChild(draggable.parentElement);
                        if (dragging.oldParent.classList.contains("content")) {
                            if (!dragging.oldParent.children.length) {
                                dragging.oldParent.classList.add("hidden");
                                dragging.oldParent.parentElement.querySelector(".label").querySelector("#dropdown").children[0].setAttribute("href", "#closed");
                            } else {
                                let found = false;
                                for (const child of dragging.oldParent.children) {
                                    if (child.tagName !== "COMPONENT") {
                                        found = true;
                                        break;
                                    } else {
                                        if (child.children.length) {
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                                let expand = true;
                                if (!found) {
                                    expand = false;
                                }
                                if (!expand) {
                                    dragging.oldParent.classList.add("hidden");
                                    dragging.oldParent.parentElement.querySelector(".label").querySelector("#dropdown").children[0].setAttribute("href", "#closed");
                                }
                            }
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
            document.querySelectorAll("[data-layer]").forEach(layer => {
                const content = layer.querySelector(".content");
                content.classList.add("hidden");
                layer.querySelector(".label").querySelector("#dropdown").children[0].setAttribute("href", "#closed");
            });
        }
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

function toggleMenu(element) {
    const content = element.parentElement.querySelector(".content");
    const svg = element.parentElement.querySelector(".label").querySelector("#dropdown").children[0];
    if (content.children.length) {
        let found = false;
        for (const child of content.children) {
            if (child.tagName !== "COMPONENT") {
                found = true;
                break;
            } else {
                if (child.children.length) {
                    found = true;
                    break;
                }
            }
        }
        let expand = true;
        if (!found) {
            expand = false;
        }
        if (content.classList.contains("hidden") && expand) {
            content.classList.remove("hidden");
            svg.setAttribute("href", "#opened");
        } else {
            content.classList.add("hidden");
            svg.setAttribute("href", "#closed");
        }
    }
}

function checkIfFileExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
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

function hideSettings() {
    const settings = document.getElementById("settings");
    const settings_button = document.getElementById("settings-button");
    settings.classList.add("hidden");
    settings_button.classList.remove("hidden");
}

function showSettings() {
    const settings = document.getElementById("settings");
    const settings_button = document.getElementById("settings-button");
    settings.classList.remove("hidden");
    settings_button.classList.add("hidden");
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
    const container = document.querySelector(`[data-layer="${layer}"]`).querySelector(".content");
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

function getValue(elementId) {
    return document.getElementById(elementId).value;
}

function fitTextOnCanvas(ctx, text, width, startSize = 100) {
    // start with a large font size
    let fontsize = startSize;

    const prevFont = ctx.font;

    ctx.font = `${fontsize}px ${CANVAS_FONT}`;

    // lower the font size until the text fits the canvas
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

function generateCode() {
    const readValues = document.querySelectorAll(".updateCard");
    const saveValues = [];
    for (let i = 0; i < readValues.length; i++) {
        if (readValues[i].dataset.nosave == null && getLayer(readValues[i]) >= 0)
            saveValues.push(readValues[i]);
    }

    const code = [];

    saveValues.forEach(saveValue => {
        let value;
        switch (saveValue.getAttribute("type")) {
            case "checkbox":
                value = saveValue.checked;
                break;
            default:
                value = saveValue.value;
                break;
        }
        code.push(`${saveValue.id}=${value}`);
    });

    {
        const components = document.querySelectorAll("[data-componenttype]");
        components.forEach(component => {
            const layer = getLayer(component);
            if (layer >= 0 && component.dataset.nosave == null) {
                code.push(`cl_${component.dataset.componenttype}=${layer}`);
            }
        });
    }

    return code.join("|");
}

function loadCode(code) {
    const codeParts = code.split("|");

    if (codeParts.length <= 1)
        return;

    document.querySelectorAll("[data-componenttype]").forEach(component => {
        if (component.dataset.subcomponent == null) {
            const layer = document.querySelector(`[data-layer="-1"]`);
            layer.querySelector(".content").appendChild(component);
        }
    });

    codeParts.forEach(codePart => {
        const parts = codePart.split("=");
        const partName = parts.shift();
        const partValue = parts.join("=");
        if (partName.startsWith("cl_")) {
            const component = document.querySelector(`[data-componenttype="${partName.substring(3, partName.length)}"`);
            const layer = document.querySelector(`[data-layer="${partValue}"]`);
            if (layer && component) {
                layer.querySelector(".content").appendChild(component);
            }
        } else {
            const element = document.getElementById(partName);
            if (element) {
                switch (element.getAttribute("type")) {
                    case "element":
                        element.checked = partValue;
                        break;
                    default:
                        element.value = partValue;
                        break;
                }
            }
        }
    });

    for (let i = 0; i < MAX_LAYERS; i++) {
        updateLayer(i);
    }
}

function saveCard() {
    const code = generateCode();

    localStorage.setItem("cardCode", code);
}

function showCode() {
    saveCard();

    const code = generateCode();
    document.getElementById("cardCode").value = code;
}

function readCode() {
    loadCode(document.getElementById("cardCode").value);
    
    saveCard();
}