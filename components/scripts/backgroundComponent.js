async function drawBackground(canvas, data) {
    const { background_cardTemplate, background_primaryColor, background_secondaryColor } = data;
    let { background_round } = data;
    background_round /= 100;

    const cardTemplatePath = `${TEMPLATES_FOLDER}/${background_cardTemplate}.png`;

    const cardTemplateImage = await loadImage(cardTemplatePath);

    const ctx = canvas.getContext("2d");
    if (cardTemplateImage) {
        const tempCanvas = createCanvas(canvasWidth, canvasHeight);
        const tempCtx = tempCanvas.getContext("2d");

        tempCtx.fillStyle = background_primaryColor;
        roundRect(tempCtx, 0, 0, canvasWidth, canvasHeight, canvasWidth * background_round);

        ctx.drawImage(drawMaskedImage(cardTemplateImage, tempCanvas, "source-in"), 0, 0);

        tempCtx.clearRect(0, 0, canvasWidth, canvasHeight);

        tempCtx.fillStyle = background_secondaryColor;
        roundRect(tempCtx, 0, 0, canvasWidth, canvasHeight, canvasWidth * background_round);

        ctx.drawImage(drawMaskedImage(cardTemplateImage, tempCanvas, "source-out"), 0, 0);
    } else {
        ctx.fillStyle = background_primaryColor;
        roundRect(ctx, 0, 0, canvasWidth, canvasHeight, canvasWidth * background_round);
    }
}