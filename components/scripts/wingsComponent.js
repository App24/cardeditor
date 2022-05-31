function togglePosition(element) {
    const wingsPosition = document.getElementById("wingsPosition");
    if (element.checked) {
        wingsPosition.classList.add("hidden");
    } else {
        wingsPosition.classList.remove("hidden");
    }
}

function toggleCustomWings(element) {
    const customWings = document.getElementById("wings_customWings");
    if (element.value == "default") {
        customWings.classList.add("hidden");
    } else {
        customWings.classList.remove("hidden");
    }
}

function mergeWings(element) {
    document.getElementById("wingsBCharacter").value = document.getElementById("wingsACharacter").value;
    document.getElementById("wingsBExample").value = document.getElementById("wingsAExample").value;

    updateLayerElement(element);
}

async function drawWings(canvas, data) {
    const { wings_template, wings_type, wings_image, wingsACharacter, wingsAExample, wingsBCharacter, wingsBExample, followPfp, wings_positionX, wings_positionY } = data;

    const ctx = canvas.getContext("2d");

    const wingsTemplatePath = `${TEMPLATES_FOLDER}/${wings_template}.png`;

    const wingsTemplateImage = await loadImage(wingsTemplatePath);

    const wingsImages = [];

    if (wings_type === "default") {
        wingsImages.push(await loadImage(`wings/${wingsAExample}/aisha.png`));
        wingsImages.push(await loadImage(`wings/${wingsBExample}/tecna.png`));
    } else {
        if (wings_image !== undefined) {
            wingsImages.push(await getImageFromBlob(wings_image));
            wingsImages.push(await getImageFromBlob(wings_image));
        } else {
            wingsImages.push(undefined);
            wingsImages.push(undefined);
        }
    }

    // const pfpRadius = (130 * getValue("pfpSize"));

    const pfpX = followPfp ? getValue("pfp_positionX") : wings_positionX;
    const pfpY = followPfp ? getValue("pfp_positionY") : wings_positionY;

    const drawWings = (wingsImage, templateImage, globalCompositeOperation) => {
        const wingsX = pfpX - wingsImage.width / 2.;
        // const wingsY = ((pfpRadius + (canvasHeight / 2.3) - pfpRadius) - wingsImage.height / 2.);
        const wingsY = pfpY - wingsImage.height / 2.;

        if (!templateImage) {
            ctx.drawImage(wingsImage, wingsX, wingsY);
        }
        else {
            ctx.drawImage(drawMaskedImage(templateImage, wingsImage, globalCompositeOperation), wingsX, wingsY);
        }
    };

    if (wingsImages.length >= 2) {
        if (wingsImages[0]) {
            drawWings(wingsImages[0], wingsTemplateImage, "source-in");
            // const wings = wingsImages[0];
            // const wingsX = pfpX - wings.width / 2.;
            // const wingsY = ((pfpRadius + (canvasHeight / 2.3) - pfpRadius) - wings.height / 2.);

            // if (!wingsTemplateImage) {
            //     ctx.drawImage(wings, wingsX, wingsY);
            // }
            // else {
            //     ctx.drawImage(drawMaskedImage(wingsTemplateImage, wings, "source-in"), wingsX, wingsY);
            // }
        }

        if (wingsImages[1]) {
            drawWings(wingsImages[1], wingsTemplateImage, "source-out");
            // const wings = wingsImages[1];
            // const wingsX = pfpX - wings.width / 2.;
            // const wingsY = ((pfpRadius + (canvasHeight / 2.3) - pfpRadius) - wings.height / 2.);

            // if (!wingsTemplateImage) {
            //     ctx.drawImage(wings, wingsX, wingsY);
            // }
            // else {
            //     ctx.drawImage(drawMaskedImage(wingsTemplateImage, wings, "source-out"), wingsX, wingsY);
            // }
        }
    } else if (wingsImages[0]) {
        drawWings(wingsImages[0], null, "source-in");
        // const wings = wingsImages[0];
        // const wingsX = pfpX - wings.width / 2.;
        // const wingsY = ((pfpRadius + (canvasHeight / 2.3) - pfpRadius) - wings.height / 2.);

        // ctx.drawImage(wings, wingsX, wingsY);
    }
}