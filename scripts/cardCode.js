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

async function loadCode(code) {
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

    await asyncForEach(codeParts, async (codePart) => {
        const parts = codePart.split("=");
        const partName = parts.shift();
        const partValue = parts.join("=");
        if (partName.startsWith("cl_")) {
            const component = document.querySelector(`[data-componenttype="${partName.substring(3, partName.length)}"`);
            const id = component.children[0].id.slice(3);
            const init_func = window[`comp_${id}_on_load`];
            if (init_func && typeof init_func === "function") {
                await init_func(component);
            }
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
    loadCode(document.getElementById("cardCode").value).then(() => saveCard());
}

function loadDefaultCode() {
    loadCode("background_primaryColor=#363636|background_secondaryColor=#363636|background_cardTemplate=normal|background_round=1|followPfp=true|wings_positionX=600|wings_positionY=300|wings_template=normal|wings_type=default|name_positionX=600|name_positionY=5|name_matchRole=true|name_nameType=nickname|name_textAlign=center|name_textBaseline=top|name_textColor=#ffffff|name_textSize=1|name_strokeColor=#000000|name_strokeSize=3|level_positionX=10|level_positionY=5|level_textAlign=left|level_textBaseline=top|level_textColor=#ffffff|level_textSize=1|level_strokeColor=#000000|level_strokeSize=0|xp_middleLevel=true|xp_positionX=100|xp_positionY=62|xp_textAlign=center|xp_textBaseline=top|xp_textColor=#ffffff|xp_textSize=1|xp_strokeColor=#000000|xp_strokeSize=0|rank_positionX=1190|rank_positionY=5|rank_textAlign=right|rank_textBaseline=top|rank_textColor=#ffffff|rank_textSize=1|rank_strokeColor=#000000|rank_strokeSize=0|currentTransformation_positionX=600|currentTransformation_positionY=500|currentTransformation_textAlign=center|currentTransformation_textBaseline=bottom|currentTransformation_textColor=#ffffff|currentTransformation_strokeColor=#000000|currentTransformation_strokeSize=0|nextTransformation_positionX=600|nextTransformation_positionY=600|nextTransformation_textAlign=center|nextTransformation_textBaseline=bottom|nextTransformation_textColor=#ffffff|nextTransformation_strokeColor=#000000|nextTransformation_strokeSize=0|pfpCircle_width=10|pfpCircle_color=#000000|xpBar_startColor=#cc0000|xpBar_endColor=#44cc00|xpBar_width=10|pfp_positionX=600|pfp_positionY=260|pfp_size=1|cl_background=0|cl_wings=1|cl_name=2|cl_level=3|cl_xp=3|cl_rank=3|cl_currentTransformation=3|cl_nextTransformation=3|cl_pfpCircle=3|cl_xpBar=4|cl_pfp=5").then(() => saveCard());
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