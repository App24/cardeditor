let currentComponentId = 0;

async function loadComponents(i = 0) {
    const components = document.querySelectorAll("[data-component]");
    if (!components || !components.length) return;
    await asyncForEach(components, async (component) => {
        const file = component.dataset.component;
        if (!file) return;
        const componentFile = `components/${file}Component.html`;
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
                        delete component.dataset.component;
                        error();
                    }
                }
            };
            xhttp.open("GET", componentFile, true);
            xhttp.send();
        }).catch(() => undefined);
    });
    await loadComponents(++i);
}