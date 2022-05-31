function drawXpBar(canvas, data) {
    const { xpBar_filled: filled } = data;
    let { xpBar_startColor, xpBar_endColor, xpBar_width } = data;

    xpBar_startColor = xpBar_startColor.removeHash();
    xpBar_endColor = xpBar_endColor.removeHash();
    xpBar_width = parseInt(xpBar_width);

    const ctx = canvas.getContext("2d");

    const pfpRadius = 130 * getValue("pfp_size");
    const cardPfpX = getValue("pfp_positionX") - pfpRadius;
    const cardPfpY = getValue("pfp_positionY") - pfpRadius;

    const startRGB = hexToRGB(xpBar_startColor);
    const startHsl = rgbToHsl(startRGB.r, startRGB.g, startRGB.b);

    const endRGB = hexToRGB(xpBar_endColor);
    const endHsl = rgbToHsl(endRGB.r, endRGB.g, endRGB.b);

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = `hsla(${blend(startHsl.h, endHsl.h, 1 - filled) * 360}, ${blend(startHsl.s, endHsl.s, 1 - filled) * 100}%, ${blend(startHsl.l, endHsl.l, 1 - filled) * 100}%, 1)`;
    ctx.lineWidth = xpBar_width * 2;
    ctx.arc(pfpRadius + cardPfpX, pfpRadius + cardPfpY, pfpRadius + xpBar_width, (Math.PI / 180) * 270, (Math.PI / 180) * (270 + (360 * filled)));
    ctx.stroke();
    ctx.restore();
}