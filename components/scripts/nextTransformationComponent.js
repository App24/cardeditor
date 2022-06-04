function drawNextTransformation(canvas, data) {
    const { nextTransformation_textAlign, nextTransformation_textBaseline, nextTransformation_text, nextTransformation_strokeSize, nextTransformation_textColor, nextTransformation_strokeColor } = data;
    const { nextTransformation_positionX, nextTransformation_positionY } = data;

    const nextRankText = `Next Transformation: ${nextTransformation_text}`;

    const ctx = canvas.getContext("2d");

    const fontSize = fitTextOnCanvas(ctx, nextRankText, canvasWidth);

    const x = parseInt(nextTransformation_positionX);
    const y = parseInt(nextTransformation_positionY) + (nextTransformation_textBaseline == "top" ? getPositionDiff(fontSize) : 0);

    ctx.font = `${fontSize}px ${CANVAS_FONT}`;
    ctx.textBaseline = nextTransformation_textBaseline;
    ctx.fillStyle = nextTransformation_textColor;
    ctx.textAlign = nextTransformation_textAlign;
    if (nextTransformation_strokeSize > 0) {
        ctx.strokeStyle = nextTransformation_strokeColor;
        ctx.lineWidth = nextTransformation_strokeSize;
        ctx.strokeText(nextRankText, x, y);
    }
    ctx.fillText(nextRankText, x, y);
}