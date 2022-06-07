function toggleXPPosition(element) {
    const xpPosition = document.getElementById("xpPosition");
    if (element.checked) {
        xpPosition.classList.add("hidden");
    } else {
        xpPosition.classList.remove("hidden");
    }
}

function drawXpText(canvas, data) {
    const { xp_text, xp_textSize, xp_middleLevel, xp_textAlign, xp_textBaseline, xp_strokeSize, xp_positionX, xp_positionY } = data;
    const { xp_textColor, xp_strokeColor } = data;

    const ctx = canvas.getContext("2d");

    let x = parseInt(xp_positionX);
    let y = parseInt(xp_positionY);

    if (xp_middleLevel) {
        const fontSize = 50 * getValue("level_textSize");

        const levelsText = `Level: ${getValue("level_text")}`;

        ctx.textBaseline = getValue("level_textBaseline");
        ctx.font = `${fontSize}px ${CANVAS_FONT}`;
        ctx.textAlign = getValue("level_textAlign");

        const metrics = ctx.measureText(levelsText);
        const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        x = parseInt(getValue("level_positionX")) + (metrics.width / 2.);
        y = parseInt(getValue("level_positionY")) + (actualHeight * 1.4);
    }

    const xpFontSize = 33.33333333333333 * xp_textSize;

    ctx.font = `${xpFontSize}px ${CANVAS_FONT}`;
    ctx.fillStyle = xp_textColor;
    ctx.textBaseline = xp_textBaseline;
    ctx.textAlign = xp_textAlign;
    if (xp_strokeSize > 0) {
        ctx.strokeStyle = xp_strokeColor;
        ctx.lineWidth = xp_strokeSize;
        ctx.strokeText(xp_text, x, y + getPositionDiff(xpFontSize, xp_textBaseline));
    }
    ctx.fillText(xp_text, x, y + getPositionDiff(xpFontSize, xp_textBaseline));
}