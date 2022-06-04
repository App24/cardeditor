function toggleNameColor(element) {
    const textColor = document.getElementById("name_textColor").parentElement;
    if (element.checked) {
        textColor.classList.add("hidden");
    } else {
        textColor.classList.remove("hidden");
    }
}

function drawName(canvas, data) {
    const { name_text, name_matchRole, name_textSize, name_textAlign, name_textBaseline, name_strokeSize, name_textColor, name_strokeColor } = data;
    const { name_positionX, name_positionY } = data;

    const ctx = canvas.getContext("2d");

    const fontSize = 60 * name_textSize;

    const x = parseInt(name_positionX);
    const y = parseInt(name_positionY) + (name_textBaseline == "top" ? getPositionDiff(fontSize) : 0);

    ctx.font = `${fontSize}px ${CANVAS_FONT}`;
    ctx.fillStyle = name_matchRole ? "white" : name_textColor;
    ctx.textBaseline = name_textBaseline;
    ctx.textAlign = name_textAlign;
    if (name_strokeSize > 0) {
        ctx.strokeStyle = name_strokeColor;
        ctx.lineWidth = name_strokeSize;
        ctx.strokeText(name_text, x, y);
    }
    ctx.fillText(name_text, x, y);
}