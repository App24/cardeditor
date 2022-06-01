NodeList.prototype.some = function (callbackFn) {
    for (const val of this) {
        if (callbackFn(val))
            return true;
    }
    return false;
}

function getParentMenu(element) {
    let menu = element;
    while (menu && !menu.classList.contains("menu")) {
        menu = menu.parentElement;
    }
    return menu;
}

function isMenuEmpty(menuElement) {
    if (!menuElement.classList.contains("menu") && (menuElement.classList.contains("content") || menuElement.classList.contains("label"))) {
        menuElement = menuElement.parentElement;
    } else if (!menuElement.classList.contains("menu")) {
        return;
    }

    const content = menuElement.querySelector(".content");

    if (content.children.length <= 0)
        return true;
    else {
        const ignoreMenuOpens = content.querySelectorAll(":scope > [data-ignoreMenuOpen]");
        return ignoreMenuOpens.length === content.children.length && ignoreMenuOpens.some((val) => {
            return val.children.length <= 0;
        });
    }
};

function collapseMenu(menuElement, recursive = false) {
    if (!menuElement.classList.contains("menu") && (menuElement.classList.contains("content") || menuElement.classList.contains("label"))) {
        menuElement = menuElement.parentElement;
    } else if (!menuElement.classList.contains("menu")) {
        return;
    }

    const content = menuElement.querySelector(".content");
    const label = menuElement.querySelector(".label");

    const dropdownSvg = label.querySelector("#dropdown").querySelector("use");
    dropdownSvg.setAttribute("href", isMenuEmpty(menuElement) ? "#closedGreyout" : "#closed");

    content.classList.add("hidden");

    if (recursive) {
        const children = content.children;
        for(const child of children){
            if(child.children.length > 0){
                collapseMenu(child.children[0]);
            }
        }
    }
}

function openMenu(menuElement) {
    if (!menuElement.classList.contains("menu") && (menuElement.classList.contains("content") || menuElement.classList.contains("label"))) {
        menuElement = menuElement.parentElement;
    } else if (!menuElement.classList.contains("menu")) {
        return;
    }

    const content = menuElement.querySelector(".content");
    const label = menuElement.querySelector(".label");

    if (!isMenuEmpty(menuElement)) {
        const dropdownSvg = label.querySelector("#dropdown").querySelector("use");
        dropdownSvg.setAttribute("href", "#opened");

        content.classList.remove("hidden");
    }
}

function toggleMenu(menuElement) {
    if (!menuElement.classList.contains("menu") && (menuElement.classList.contains("content") || menuElement.classList.contains("label"))) {
        menuElement = menuElement.parentElement;
    } else if (!menuElement.classList.contains("menu")) {
        return;
    }

    if (menuElement.querySelector(".content").classList.contains("hidden")) {
        openMenu(menuElement);
    } else {
        collapseMenu(menuElement);
    }
}

function getLayerMenu(layer) {
    return document.querySelector(`[data-layer="${layer}"]`);
}

function getLayerMenus() {
    return document.querySelectorAll(`[data-layer]`);
}