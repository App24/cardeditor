function drawNextTransformation(canvas, data) {
    const { nextTransformation_textAlign, nextTransformation_textBaseline, nextTransformation_text, nextTransformation_strokeSize, nextTransformation_positionX, nextTransformation_positionY } = data;
    let { nextTransformation_textColor, nextTransformation_strokeColor } = data;

    nextTransformation_textColor = nextTransformation_textColor.removeHash();
    nextTransformation_strokeColor = nextTransformation_strokeColor.removeHash();

    const nextRankText = `Next Transformation: ${nextTransformation_text}`;

    const ctx = canvas.getContext("2d");

    const fontSize = fitTextOnCanvas(ctx, nextRankText, canvasWidth);

    ctx.font = `${fontSize}px ${CANVAS_FONT}`;
    ctx.textBaseline = nextTransformation_textBaseline;
    ctx.fillStyle = `#${nextTransformation_textColor}`;
    ctx.textAlign = nextTransformation_textAlign;
    if (nextTransformation_strokeSize > 0) {
        ctx.strokeStyle = `#${nextTransformation_strokeColor}`;
        ctx.lineWidth = nextTransformation_strokeSize;
        ctx.strokeText(nextRankText, nextTransformation_positionX, nextTransformation_positionY);
    }
    ctx.fillText(nextRankText, nextTransformation_positionX, nextTransformation_positionY);
}