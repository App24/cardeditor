function drawName(canvas, data) {
    const { name_text, name_textSize, name_textAlign, name_textBaseline, name_strokeSize, name_positionX, name_positionY } = data;
    let { name_textColor, name_strokeColor } = data;

    name_textColor = name_textColor.removeHash();
    name_strokeColor = name_strokeColor.removeHash();

    const ctx = canvas.getContext("2d");

    const fontSize = 60 * name_textSize;

    ctx.font = `${fontSize}px ${CANVAS_FONT}`;
    ctx.fillStyle = `#${name_textColor}`;
    ctx.textBaseline = name_textBaseline;
    ctx.textAlign = name_textAlign;
    if (name_strokeSize > 0) {
        ctx.strokeStyle = `#${name_strokeColor}`;
        ctx.lineWidth = name_strokeSize;
        ctx.strokeText(name_text, name_positionX, name_positionY);
    }
    ctx.fillText(name_text, name_positionX, name_positionY);
}