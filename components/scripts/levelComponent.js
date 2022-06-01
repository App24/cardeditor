function drawLevelsText(canvas, data) {
    const { level_text, level_textSize, level_textAlign, level_textBaseline, level_strokeSize, level_textColor, level_strokeColor } = data;
    const { level_positionX, level_positionY } = data;

    const ctx = canvas.getContext("2d");

    const fontSize = 50 * level_textSize;

    const levelsText = `Level: ${level_text}`;

    ctx.textBaseline = level_textBaseline;
    ctx.fillStyle = level_textColor;
    ctx.font = `${fontSize}px ${CANVAS_FONT}`;
    ctx.textAlign = level_textAlign;
    if (level_strokeSize > 0) {
        ctx.strokeStyle = level_strokeColor;
        ctx.lineWidth = level_strokeSize;
        ctx.strokeText(levelsText, level_positionX, level_positionY);
    }
    ctx.fillText(levelsText, level_positionX, level_positionY);
}