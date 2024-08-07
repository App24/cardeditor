import { BackgroundComponent } from "./components/backgroundComponent.mjs";
import { CurrentTransformationComponent } from "./components/currentTransformationComponent.mjs";
import { LevelsComponent } from "./components/levelsComponent.mjs";
import { NameComponent } from "./components/nameComponent.mjs";
import { NextTransformationComponent } from "./components/nextTransformationComponent.mjs";
import { PfpCircleComponent } from "./components/pfpCircleComponent.mjs";
import { PfpComponent } from "./components/pfpComponent.mjs";
import { RankComponent } from "./components/rankComponent.mjs";
import { WeeklyRankComponent } from "./components/weeklyRankComponent.mjs";
import { WingsComponent } from "./components/wingsComponent.mjs";
import { CustomWingsComponent } from "./components/customWingsComponent.mjs";
import { XpBarComponent } from "./components/xpBarComponent.mjs";
import { LeaderboardComponent } from "./components/leaderboardComponent.mjs";
import { XpComponent } from "./components/xpComponent.mjs";
import { Menu } from "./menu.mjs";
import { MAX_LAYERS, CARD_WIDTH, CARD_HEIGHT, DEFAULT_CODE } from "./constants.mjs"
import { asyncForEach, createCanvas, drawMaskedImage } from "./utils.mjs"
import { SubComponent } from "./subComponent.mjs";
import { RoleIconComponent } from "./components/roleIconComponent.mjs";
import { Snackbar } from "./snackbar.mjs";

class Application {
    constructor() {
        this.currentId = 0;
        this.components = [];
        this.menus = [];

        this.dragComponents();

        addEventListener("load", async () => {
            const settingsMenu = new Menu("Settings");
            document.getElementById("settings").appendChild(settingsMenu.menu);
            {
                {
                    this.disabledComponentsMenu = new Menu("Disabled Widgets");
                    this.disabledComponentsMenu.menu.dataset.layer = -1;
                    settingsMenu.addContent(this.disabledComponentsMenu);
                    this.menus.push(this.disabledComponentsMenu);
                }

                {
                    for (let i = 0; i < MAX_LAYERS; i++) {
                        const layerMenu = new Menu(`Layer ${i + 1}`);
                        layerMenu.menu.dataset.layer = i;
                        settingsMenu.addContent(layerMenu);
                        this.menus.push(layerMenu);
                    }
                }

                {
                    this.leaderboardComponent = new LeaderboardComponent();
                    this.leaderboardComponent.id = this.currentId++;

                    const componentMenu = this.createComponentMenu(this.leaderboardComponent, false);
                    componentMenu.label.style.backgroundColor = "rgb(46, 26, 46)";
                    componentMenu.content.style.backgroundColor = "rgba(71, 51, 71, 0.8)";
                    settingsMenu.addContent(componentMenu);
                }
                {
                    const input = document.createElement("input");
                    input.type = "button";
                    input.value = "Add Custom Wings";

                    input.addEventListener("click", async() => {
                        const customWingsComponent = this.components.find(c=>c instanceof CustomWingsComponent);
                        const backgroundComponent = this.components.find(c=>c instanceof BackgroundComponent);

                        const hasBackground = backgroundComponent.layer >= 0;

                        const customWingsComponentMenu = this.getComponentMenu(customWingsComponent);

                        const layer = hasBackground ? backgroundComponent.layer : 0;

                        const previousLayer = customWingsComponent.layer;

                        const menu = this.menus.find(m => m.menu.dataset.layer == layer);
                        if (menu) {
                            menu.addContent(customWingsComponentMenu);
                            menu.openMenu();
                            {
                                const required = this.getRequiredComponents(customWingsComponent);
                                required.forEach(requiredComponent => {
                                    const requiredComponentMenu = this.menus.find(m => m.menu.dataset.component === requiredComponent.componentId);
                                    if (this.getLayer(requiredComponent) < 0) {
                                        // requiredComponent.dataTypes.forEach(dataType => dataType.disabled = false);
                                        this.toggleComponent(requiredComponent, false);
                                        menu.addContent(requiredComponentMenu);
                                    }
                                });
                            }
                            {
                                const dependant = this.getDependantComponents(customWingsComponent).filter(comp => this.getLayer(comp) >= 0);

                                if (dependant.length && draggedOver.dataset.layer < 0) {
                                    const dependantMenu = this.menus.find(m => m.menu.dataset.component === dependant[0].componentId)
                                    let parentMenu = dependantMenu.parentMenu;

                                    while (parentMenu && parentMenu.menu.dataset.layer == null) {
                                        parentMenu = parentMenu.parentMenu;
                                    }

                                    parentMenu.addContent(componentMenu);

                                    draggedOver = parentMenu.menu;
                                }
                            }
                            this.toggleComponent(customWingsComponent, layer <= -1);
                            await this.drawLayer(layer);

                            {
                                const otherMenu = this.menus.find(m=>m.menu.dataset.layer == previousLayer);
                                if (otherMenu && otherMenu.isEmpty()) {
                                    otherMenu.closeMenu();
                                }
                            }
                        }


                        Snackbar.createSnackbar("Added Custom Wings!");
                    });

                    settingsMenu.addContent(input);
                }

                {
                    const fieldset = document.createElement("fieldset");
                    const legend = document.createElement("legend");
                    legend.innerText = "Visible Layers";
                    fieldset.appendChild(legend);
                    for (let i = 0; i < MAX_LAYERS; i++) {
                        const div = document.createElement("div");
                        const label = document.createElement("label");
                        const input = document.createElement("input");

                        input.type = "checkbox";
                        input.checked = true;
                        input.id = `checkbox_layer${i}`;
                        input.name = `checkbox_layer${i}`;

                        label.htmlFor = `checkbox_layer${i}`;
                        label.textContent = `Layer ${i + 1}`;

                        input.addEventListener("input", () => {
                            const canvas = document.querySelectorAll(".layerCanvas")[i];
                            canvas.hidden = !input.checked;
                        });

                        div.appendChild(input);
                        div.appendChild(label);
                        fieldset.appendChild(div);
                    }
                    settingsMenu.addContent(fieldset);
                }
                {
                    const wontSave = document.createElement("p");
                    wontSave.innerText = "*won't be saved!";
                    settingsMenu.addContent(wontSave);
                }
                {
                    const input = document.createElement("input");
                    input.type = "button";
                    input.value = "Generate Code";

                    input.addEventListener("click", () => {
                        const cardCode = this.getCode();

                        localStorage.setItem("cardCode", cardCode);
                        const cardCodeInput = document.getElementById("cardCode");
                        cardCodeInput.value = cardCode;
                        cardCodeInput.select();

                        Snackbar.createSnackbar("Code Generated!");
                    });

                    settingsMenu.addContent(input);
                }
                {
                    const input = document.createElement("input");
                    input.type = "button";
                    input.value = "Load Code";
                    input.style.marginLeft = "0.3vw";

                    input.addEventListener("click", () => {
                        const cardCodeInput = document.getElementById("cardCode");
                        const value = cardCodeInput.value;
                        if (value == "" || value == null) {
                            Snackbar.createSnackbar("No Code!");
                            return;
                        }
                        this.loadCode(value);

                        this.menus.forEach(menu => {
                            menu.closeMenu();
                        });

                        settingsMenu.openMenu();

                        Snackbar.createSnackbar("Code Loaded!");
                    });

                    settingsMenu.addContent(input);
                }
                {
                    const input = document.createElement("input");
                    input.type = "button";
                    input.value = "Load Default Code";
                    input.style.marginLeft = "0.3vw";

                    input.addEventListener("click", () => {
                        this.loadCode(DEFAULT_CODE);

                        this.menus.forEach(menu => {
                            menu.closeMenu();
                        });

                        settingsMenu.openMenu();

                        Snackbar.createSnackbar("Loaded Default Code!");
                    });

                    settingsMenu.addContent(input);
                }

                {
                    const input = document.createElement("input");
                    input.type = "button";
                    input.value = "Clear Code";
                    input.style.marginLeft = "0.3vw";

                    input.addEventListener("click", () => {
                        this.loadCode("");

                        this.menus.forEach(menu => {
                            menu.closeMenu();
                        });

                        settingsMenu.openMenu();

                        Snackbar.createSnackbar("Code Cleared!");
                    });

                    settingsMenu.addContent(input);
                }

                settingsMenu.addContent(document.createElement("br"));
                {
                    const label = document.createElement("label");
                    label.htmlFor = "cardCode";
                    label.textContent = "Code: ";

                    const input = document.createElement("input");
                    input.type = "text";
                    input.name = "cardCode";
                    input.id = "cardCode";
                    input.style.width = "30vw";
                    input.style.minWidth = "360px";

                    settingsMenu.addContent(label);
                    settingsMenu.addContent(input);
                }
                settingsMenu.addContent(document.createElement("br"));
                {
                    const wontSave = document.createElement("text");
                    wontSave.innerText = `Do w!cardcode, select "set", and then reply with the code generated here!`;
                    settingsMenu.addContent(wontSave);
                }
            }
            this.menus.push(settingsMenu);

            this.addComponent(new BackgroundComponent());
            this.addComponent(new NameComponent());
            this.addComponent(new PfpComponent());
            this.addComponent(new PfpCircleComponent());
            this.addComponent(new WingsComponent());
            this.addComponent(new CustomWingsComponent());
            this.addComponent(new LevelsComponent());
            this.addComponent(new XpComponent());
            this.addComponent(new XpBarComponent());
            this.addComponent(new RankComponent());
            this.addComponent(new WeeklyRankComponent());
            this.addComponent(new CurrentTransformationComponent());
            this.addComponent(new NextTransformationComponent());
            this.addComponent(new RoleIconComponent());

            {
                this.components.forEach(component => {
                    this.getDependantComponents(component).forEach(comp => {
                        comp.requiredComponents.forEach(c => {
                            c.component = component;
                        });
                    });
                });
            }

            {
                const cardCanvas = document.getElementById("cardCanvas");
                for (let i = 0; i < MAX_LAYERS; i++) {
                    const canvas = document.createElement("canvas");
                    canvas.classList.add("layerCanvas");
                    canvas.width = CARD_WIDTH;
                    canvas.height = CARD_HEIGHT;
                    cardCanvas.appendChild(canvas);
                }
            }

            this.loadCode(localStorage.getItem("cardCode") ?? DEFAULT_CODE);

            this.menus.forEach(menu => {
                menu.closeMenu();
            });
        });
    }

    dragComponents() {
        const getCanvas = (e) => {
            const elements = document.elementsFromPoint(e.clientX, e.clientY);
            if (elements.length <= 0 || !elements[0].classList.contains("layerCanvas")) return [];
            return elements.filter(e => e.classList.contains("layerCanvas"));
        }

        let draggedComponent, hoveredComponent;
        let dragCanvas;
        let diffX;
        let diffY;

        const getHoveredComponent = async (e, canvas, layer) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ctx = canvas.getContext("2d");

            const getComponentsAtLayer = () => {
                return this.components.filter(component => {
                    if (!(component instanceof SubComponent)) {
                        return this.getLayer(component) == layer;
                    }
                    return false;
                });
            };

            const componentsAtLayer = getComponentsAtLayer();
            let toReturn;
            await asyncForEach(componentsAtLayer, async (component) => {
                if (!component.hasPosition) return;
                const boundingRect = await component.getBoundingRect(ctx);
                if (boundingRect) {
                    if (boundingRect.left < x && boundingRect.top < y && (boundingRect.left + boundingRect.width) > x && (boundingRect.top + boundingRect.height) > y) {
                        if (true) {
                            if (ctx.getImageData(x, y, 1, 1).data[3] != 0) {
                                toReturn = component;
                                return true;
                            }
                        }
                    }
                }
            });
            return toReturn;
        }

        const startDragging = async (e) => {
            const elements = getCanvas(e);

            await asyncForEach(elements, async (element, i) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ctx = element.getContext("2d");

                const layer = MAX_LAYERS - i - 1;
                // const componentsAtLayer = getComponentsAtLayer(layer);

                // const getClickedComponent = async () => {
                //     let toReturn;
                //     await asyncForEach(componentsAtLayer, async (component) => {
                //         if (!component.hasPosition) return;
                //         const boundingRect = await component.getBoundingRect(ctx);
                //         if (boundingRect) {
                //             if (boundingRect.left < x && boundingRect.top < y && (boundingRect.left + boundingRect.width) > x && (boundingRect.top + boundingRect.height) > y) {
                //                 if (true) {
                //                     if (ctx.getImageData(x, y, 1, 1).data[3] != 0) {
                //                         toReturn = component;
                //                         return true;
                //                     }
                //                 }
                //             }
                //         }
                //     });
                //     return toReturn;
                // };

                const clickedComponent = await getHoveredComponent(e, element, layer);
                if (clickedComponent) {
                    draggedComponent = clickedComponent;
                    dragCanvas = element;
                    const boundingRect = await draggedComponent.getBoundingRect(ctx);
                    diffX = x - boundingRect.left;
                    diffY = y - boundingRect.top;
                    return true;
                }
            });
        };

        const drag = async (e) => {
            if (draggedComponent) {
                const canvas = dragCanvas;
                const ctx = canvas.getContext("2d");
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                draggedComponent.setPosition({ x, y, diffX, diffY }, ctx);
                await this.drawLayerFull(draggedComponent, this.getLayer(draggedComponent));
            }
        };

        const endDrag = async (e) => {
            draggedComponent = null;
        };

        addEventListener("mousedown", async (e) => {
            await startDragging(e);
        });

        addEventListener("touchstart", async (e) => {
            await startDragging(e.changedTouches[0]);
        });

        addEventListener("mousemove", async (e) => {
            await drag(e);
        });

        // addEventListener("mousemove", async (e) => {
        //     const elements = getCanvas(e);

        //     let oldLayer = -1;
        //     let oldComponent;
        //     if (hoveredComponent) {
        //         hoveredComponent.hover = false;
        //         oldComponent = hoveredComponent;
        //         oldLayer = this.getLayer(hoveredComponent);
        //     }
        //     const result = await asyncForEach(elements, async (element, i) => {
        //         const layer = MAX_LAYERS - i - 1;
        //         // const componentsAtLayer = getComponentsAtLayer(layer);

        //         // const getClickedComponent = async () => {
        //         //     let toReturn;
        //         //     await asyncForEach(componentsAtLayer, async (component) => {
        //         //         if (!component.hasPosition) return;
        //         //         const boundingRect = await component.getBoundingRect(ctx);
        //         //         if (boundingRect) {
        //         //             if (boundingRect.left < x && boundingRect.top < y && (boundingRect.left + boundingRect.width) > x && (boundingRect.top + boundingRect.height) > y) {
        //         //                 if (true) {
        //         //                     if (ctx.getImageData(x, y, 1, 1).data[3] != 0) {
        //         //                         toReturn = component;
        //         //                         return true;
        //         //                     }
        //         //                 }
        //         //             }
        //         //         }
        //         //     });
        //         //     return toReturn;
        //         // };

        //         const hoverComponent = await getHoveredComponent(e, element, layer);
        //         if (hoverComponent) {
        //             hoveredComponent = hoverComponent;
        //             // dragCanvas = element;
        //             // const boundingRect = await draggedComponent.getBoundingRect(ctx);
        //             // diffX = x - boundingRect.left;
        //             // diffY = y - boundingRect.top;
        //             return true;
        //         }
        //     });
        //     if (!result) {
        //         hoveredComponent = null;
        //     }
        //     if (hoveredComponent && oldLayer !== this.getLayer(hoveredComponent)) {
        //         hoveredComponent.hover = true;
        //         await this.drawLayer(this.getLayer(hoveredComponent));
        //     }
        //     if ((!hoveredComponent && oldLayer >= 0) || (hoveredComponent && this.getLayer(hoveredComponent) !== oldLayer)) {
        //         await this.drawLayer(oldLayer);
        //     }
        // });

        addEventListener("touchmove", async (e) => {
            await drag(e.changedTouches[0]);
        });

        addEventListener("mouseup", async (e) => {
            await endDrag(e);
        });

        addEventListener("touchend", async (e) => {
            await endDrag(e.changedTouches[0]);
        });
    }

    parseCode(code) {
        if (code === undefined) return;
        const parts = code.split("|");

        this.components.forEach(component => {
            if (!(component instanceof SubComponent)) {
                const layerMenu = this.menus.find(m => m.menu.dataset.layer === "-1");
                const componentMenu = this.menus.find(m => m.menu.dataset.component === component.componentId);
                layerMenu.addContent(componentMenu);
            }
        });

        parts.filter(p => !p.startsWith("cl_")).forEach(part => {
            const valueParts = part.split("=");
            const key = valueParts.shift();
            const value = valueParts.join("=");
            this.components.some(component => {
                if (!component.dataTypes.forEach(dataType => {
                    if (dataType.valueElement.id === key) {
                        dataType.value = value;
                        return true;
                    }
                    return false;
                })) {
                    this.leaderboardComponent.dataTypes.forEach(dataType => {
                        if (dataType.valueElement.id === key) {
                            dataType.value = value;
                        }
                    })
                }
            });
        });

        parts.filter(p => p.startsWith("cl_")).sort((a, b) => {
            const getLayerSubLayer = (val) => {
                const valueParts = val.split("=");
                const key = valueParts.shift();
                const value = valueParts.join("=");

                const parts = value.split(".");
                return { layer: parseInt(parts[0]), subLayer: (parts.length > 1 ? parseInt(parts[1]) : 0) };
            };

            const aLayer = getLayerSubLayer(a);
            const bLayer = getLayerSubLayer(b);

            if (aLayer.layer === bLayer.layer) {
                return aLayer.subLayer - bLayer.subLayer;
            }
            return aLayer.layer - bLayer.subLayer;
        }).forEach(part => {
            const valueParts = part.split("=");
            const key = valueParts.shift();
            const value = valueParts.join("=").split(".")[0];
            const component = this.components.find(c => c.componentId === key.substring(3));
            if (component) {
                const componentMenu = this.menus.find(m => m.menu.dataset.component === component.componentId);
                const layerMenu = this.menus.find(m => m.menu.dataset.layer === value);
                if (layerMenu && componentMenu) {
                    layerMenu.addContent(componentMenu);
                }
            }
        });

        this.components.forEach(component => {
            const layer = this.getLayer(component);
            if (!(component instanceof SubComponent))
                this.toggleComponent(component, layer < 0);
        });
    }

    getCode() {
        const code = [];
        this.components.forEach(component => {
            const layer = this.getLayer(component);
            if ((layer >= 0 && !component.parentElement.hidden)) {
                component.dataTypes.forEach(dataType => {
                    const element = dataType.valueElement;
                    if (element.dataset.nosave == null) {
                        if (!dataType.parentElement.hidden) {
                            code.push(`${element.id}=${dataType.value}`);
                        }
                    }
                });
            }
        });

        this.leaderboardComponent.dataTypes.forEach(dataType => {
            const element = dataType.valueElement;
            if (element.dataset.nosave == null) {
                if (!dataType.parentElement.hidden) {
                    code.push(`${element.id}=${dataType.value}`);
                }
            }
        });

        this.components.forEach(component => {
            const layer = this.getLayer(component);
            if (layer >= 0 && !(component instanceof SubComponent)) {
                const parentElement = component.parentElement.parentElement;
                const children = parentElement.children;
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (child.dataset.component === component.componentId) {
                        code.push(`cl_${component.componentId}=${layer}.${i}`);
                    }
                }
            }
        });

        return code.join("|");
    }

    loadCode(code) {
        this.parseCode(code);

        this.components.forEach(component => {
            component.onLoad();
        });

        this.leaderboardComponent.onLoad();

        for (let i = 0; i < MAX_LAYERS; i++) {
            this.drawLayer(i);
        }

        localStorage.setItem("cardCode", code);
    }

    createComponentMenu(component, draggable) {
        const componentMenu = new Menu(component.name, draggable);
        component.dataTypes.forEach(dataType => {
            componentMenu.addContent(dataType.createHTML(component.componentId, async () => await this.drawLayerFull(component, componentMenu.parentMenu.menu.dataset.layer)));
        });

        if (component.description) {
            componentMenu.setLabelTitle(component.description);
        }

        component.parentElement = componentMenu.menu;
        componentMenu.menu.dataset.component = component.componentId;
        this.menus.push(componentMenu);

        return componentMenu;
    }

    getComponentMenu(component){
        return this.menus.find(m=>m.label.innerText === component.name);
    }

    addComponent(component, subComponent = false) {
        component.id = this.currentId++;

        if (!subComponent) {
            const componentMenu = this.createComponentMenu(component, true);
            this.disabledComponentsMenu.addContent(componentMenu);

            {
                const initDragging = (e) => {
                    componentMenu.clicked = true;
                    componentMenu.dragging = false;
                    componentMenu.clientX = e.clientX;
                    componentMenu.clientY = e.clientY;
                };

                const startDragging = async (e) => {
                    if (componentMenu.clicked) {
                        const diffX = e.clientX - componentMenu.clientX;
                        const diffY = e.clientY - componentMenu.clientY;
                        const distance = Math.sqrt((diffX * diffX) + (diffY * diffY));
                        if (distance >= 10) {
                            componentMenu.clicked = false;
                            componentMenu.dragging = true;
                            componentMenu.closeMenu();
                            componentMenu.menu.classList.add("dragging");
                            document.getElementById("dragging-heaven").appendChild(componentMenu.menu);
                            if (componentMenu.parentMenu.isEmpty()) {
                                componentMenu.parentMenu.closeMenu();
                            }
                            await this.drawLayer(componentMenu.parentMenu.menu.dataset.layer);
                        }
                    }
                };

                const dragComponent = (e) => {
                    if (componentMenu.dragging) {
                        componentMenu.menu.style.left = e.clientX;
                        componentMenu.menu.style.top = e.clientY;
                    }
                }

                const releaseComponent = async (e) => {
                    if (componentMenu.dragging) {
                        componentMenu.dragging = false;
                        componentMenu.menu.classList.remove("dragging");
                        let draggedOver = document.elementFromPoint(e.clientX, e.clientY);
                        if (draggedOver.tagName != "DIV") {
                            componentMenu.parentMenu.addContent(componentMenu);
                            componentMenu.parentMenu.openMenu();
                            await this.drawLayer(componentMenu.parentMenu.menu.dataset.layer);
                            return;
                        }
                        if (draggedOver.classList.contains("label") || draggedOver.classList.contains("content")) {
                            draggedOver = draggedOver.parentElement;
                        } else if (!draggedOver.classList.contains("menu")) {
                            componentMenu.parentMenu.addContent(componentMenu);
                            componentMenu.parentMenu.openMenu();
                            await this.drawLayer(componentMenu.parentMenu.menu.dataset.layer);
                            return;
                        }

                        if (draggedOver.dataset.layer == null) {
                            let parentElement = draggedOver.parentElement;

                            while (parentElement && parentElement.dataset.layer == null) {
                                parentElement = parentElement.parentElement;
                            }

                            if (parentElement == null) {
                                componentMenu.parentMenu.addContent(componentMenu);
                                componentMenu.parentMenu.openMenu();
                                await this.drawLayer(componentMenu.parentMenu.menu.dataset.layer);
                                return;
                            }

                            draggedOver = parentElement;
                        }

                        const menu = this.menus.find(m => m.menu.dataset.layer == draggedOver.dataset.layer);
                        if (menu) {
                            menu.addContent(componentMenu);
                            menu.openMenu();
                            {
                                const required = this.getRequiredComponents(component);
                                required.forEach(requiredComponent => {
                                    const requiredComponentMenu = this.menus.find(m => m.menu.dataset.component === requiredComponent.componentId);
                                    if (this.getLayer(requiredComponent) < 0) {
                                        // requiredComponent.dataTypes.forEach(dataType => dataType.disabled = false);
                                        this.toggleComponent(requiredComponent, false);
                                        menu.addContent(requiredComponentMenu);
                                    }
                                });
                            }
                            {
                                const dependant = this.getDependantComponents(component).filter(comp => this.getLayer(comp) >= 0);

                                if (dependant.length && draggedOver.dataset.layer < 0) {
                                    const dependantMenu = this.menus.find(m => m.menu.dataset.component === dependant[0].componentId)
                                    let parentMenu = dependantMenu.parentMenu;

                                    while (parentMenu && parentMenu.menu.dataset.layer == null) {
                                        parentMenu = parentMenu.parentMenu;
                                    }

                                    parentMenu.addContent(componentMenu);

                                    draggedOver = parentMenu.menu;
                                }
                            }
                            this.toggleComponent(component, draggedOver.dataset.layer <= -1);
                            await this.drawLayer(draggedOver.dataset.layer);
                        }

                    } else if (componentMenu.clicked) {
                        componentMenu.clicked = false;
                        componentMenu.dragging = false;
                    }
                }

                componentMenu.label.addEventListener("mouseover", () => {
                    component.hover = true;
                    this.drawLayer(this.getLayer(component));
                });

                componentMenu.label.addEventListener("mouseout", () => {
                    component.hover = false;
                    this.drawLayer(this.getLayer(component));
                });

                componentMenu.label.addEventListener("mousedown", (e) => {
                    initDragging(e);
                });

                componentMenu.label.addEventListener("touchstart", (e) => {
                    initDragging(e.changedTouches[0]);
                });

                addEventListener("mousemove", async (e) => {
                    await startDragging(e);
                });

                addEventListener("touchmove", async (e) => {
                    await startDragging(e.changedTouches[0]);
                });

                addEventListener("mousemove", (e) => {
                    dragComponent(e);
                });

                addEventListener("touchmove", (e) => {
                    dragComponent(e.changedTouches[0]);
                });

                addEventListener("mouseup", async (e) => {
                    await releaseComponent(e);
                });

                addEventListener("touchend", async (e) => {
                    await releaseComponent(e.changedTouches[0]);
                });
            }
        } else {
            let parentComponent = component.parentComponent;
            while (parentComponent && parentComponent.parentComponent) {
                parentComponent = parentComponent.parentComponent;
            }
            const componentMenu = this.menus[this.menus.length - 1];
            const fieldset = document.createElement("fieldset");
            const legend = document.createElement("legend");
            legend.innerText = component.name;
            fieldset.appendChild(legend);
            component.createDataTypes();
            component.parentElement = fieldset;
            component.dataTypes.forEach(dataType => {
                fieldset.appendChild(dataType.createHTML(component.componentId, async () => await this.drawLayerFull(component, componentMenu.parentMenu.menu.dataset.layer)));
            });
            componentMenu.addContent(fieldset);
        }

        this.components.push(component);

        component.subComponents.forEach(subComponent => {
            subComponent.parentComponent = component;
            subComponent.componentId = subComponent.parentComponent.componentId;
            this.addComponent(subComponent, true);
        });

    }

    getRequiredComponents(component) {
        const components = [];
        component.requiredComponents.forEach(requiredComponent => {
            const comp = this.components.find(c => c.componentId === requiredComponent.id);
            if (comp && requiredComponent.validation()) {
                components.push(comp);
            }
        });
        return components;
    }

    getDependantComponents(component) {
        const components = [];
        this.components.forEach(comp => {
            comp.requiredComponents.forEach(requiredComponent => {
                if (requiredComponent.id === component.componentId && requiredComponent.validation() && !(component instanceof SubComponent)) {
                    components.push(comp);
                }
            });
        });
        return components;
    }

    toggleComponent(component, value) {
        component.dataTypes.forEach(dataType => dataType.disabled = value);
        component.subComponents.forEach(subComponent => this.toggleComponent(subComponent, value));
    }

    async drawLayerFull(component, layer) {
        const dependant = this.getDependantComponents(component.parentComponent ?? component).filter(comp => {
            const componentLayer = this.getLayer(comp);

            return componentLayer >= 0 && componentLayer != layer;
        });
        await this.drawLayer(layer);
        const layersDrawn = [];
        await asyncForEach(dependant, async (c) => {
            const componentLayer = this.getLayer(c);

            if (!layersDrawn.includes(componentLayer)) {
                await this.drawLayer(componentLayer);
                layersDrawn.push(componentLayer);
            }
        });
    }

    async drawLayer(layer) {
        if (layer < 0) return;
        const components = this.components.filter(c => c.layer == layer).sort((a, b) => a.subLayer - b.subLayer);
        const canvas = document.querySelectorAll(".layerCanvas")[layer];
        if (canvas) {
            canvas.width = CARD_WIDTH;
            canvas.height = CARD_HEIGHT;
            const ctx = canvas.getContext("2d");
            await asyncForEach(components, async (component) => {
                const otherCanvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
                const otherCtx = otherCanvas.getContext("2d");
                const boundingRect = await component.getBoundingRect(ctx);
                if (component.drawBoundingRect) {
                    if (boundingRect) {
                        otherCtx.fillStyle = "blue";
                        otherCtx.fillRect(boundingRect.left, boundingRect.top, boundingRect.width, boundingRect.height);
                    }
                }
                await component.draw(otherCtx);
                if (component.hover) {
                    {
                        const _canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
                        const _ctx = _canvas.getContext("2d");

                        await component.draw(_ctx);

                        _ctx.globalCompositeOperation = "source-in";

                        _ctx.fillStyle = "yellow";
                        _ctx.globalAlpha = 0.5;
                        _ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
                        _ctx.globalAlpha = 1;

                        otherCtx.drawImage(_canvas, 0, 0);

                        _canvas.remove();
                    }
                }
                ctx.drawImage(otherCanvas, 0, 0);
                otherCanvas.remove();
            });
        }
    }

    getLayer(component) {
        const parentMenu = this.getLayerMenu(component);

        if (!parentMenu || !parentMenu.menu) {
            return -1;
        }

        return parentMenu.menu.dataset.layer ?? -1;
    }

    getLayerMenu(component) {
        const dependantMenu = this.menus.find(m => m.menu.dataset.component === component.componentId)
        let parentMenu = dependantMenu.parentMenu;

        while (parentMenu && parentMenu.menu.dataset.layer == null) {
            parentMenu = parentMenu.parentMenu;
        }
        return parentMenu;
    }
}

export const application = new Application();