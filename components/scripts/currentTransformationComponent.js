function drawCurrentTransformation(canvas, data) {
    const { currentTransformation_textAlign, currentTransformation_textBaseline, currentTransformation_text, currentTransformation_strokeSize, currentTransformation_textColor, currentTransformation_strokeColor } = data;
    const { currentTransformation_positionX, currentTransformation_positionY } = data;

    const currentRankText = `Current Transformation: ${currentTransformation_text}`;

    const ctx = canvas.getContext("2d");

    const fontSize = fitTextOnCanvas(ctx, currentRankText, canvasWidth);

    const x = parseInt(currentTransformation_positionX);
    const y = parseInt(currentTransformation_positionY) + getPositionDiff(fontSize, currentTransformation_textBaseline);

    ctx.font = `${fontSize}px ${CANVAS_FONT}`;
    ctx.textBaseline = currentTransformation_textBaseline;
    ctx.fillStyle = currentTransformation_textColor;
    ctx.textAlign = currentTransformation_textAlign;
    if (currentTransformation_strokeSize > 0) {
        ctx.strokeStyle = currentTransformation_strokeColor;
        ctx.lineWidth = currentTransformation_strokeSize;
        ctx.strokeText(currentRankText, x, y);
    }
    ctx.fillText(currentRankText, x, y);
}