const typeSets = [{ name: "checkbox", value: "checked", check: (val) => val === "true" }];

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
        const attribute = saveValue.getAttribute("type");
        if (typeSets.findIndex(v => v.name === attribute) >= 0) {
            value = saveValue[typeSets.find(v => v.name === attribute).value];
        } else {
            value = saveValue["value"];
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
        
    {
        const availableWidgetsLayer = getLayerMenu(-1);
        document.querySelectorAll("[data-componenttype]").forEach(component => {
            if (component.dataset.subcomponent == null) {
                availableWidgetsLayer.querySelector(".content").appendChild(component);
            }
        });
    }

    codeParts.forEach(codePart => {
        const parts = codePart.split("=");
        const partName = parts.shift();
        const partValue = parts.join("=");
        if (partName.startsWith("cl_")) {
            const component = document.querySelector(`[data-componenttype="${partName.substring(3, partName.length)}"`);
            const layer = getLayerMenu(partValue);
            if (layer && component) {
                layer.querySelector(".content").appendChild(component);
            }
        } else {
            const element = document.getElementById(partName);
            if (element) {
                const attribute = element.getAttribute("type");
                const typeSet = typeSets.find(v => v.name === attribute);
                if (typeSet) {
                    if (typeSet.check) {
                        element[typeSet.value] = typeSet.check(partValue);
                    } else {
                        element[typeSet.value] = partValue;
                    }
                } else {
                    element["value"] = partValue;
                }
            }
        }
    });

    {
        const layers = getLayerMenus();
        layers.forEach(layer => {
            collapseMenu(layer, true);
        });
    }

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
    document.getElementById("cardCode").select();
}

function readCode() {
    loadCode(document.getElementById("cardCode").value);

    saveCard();
}

function getValue(elementId) {
    const element = document.getElementById(elementId);
    const attribute = element.getAttribute("type");
    const typeSet = typeSets.find(v => v.name === attribute);
    if (typeSet) {
        return element[typeSet.value];
    } else {
        return element["value"];
    }
}