function drawPfpCircle(canvas, data) {
    const { pfpCircle_color } = data;
    let { pfpCircle_width } = data;

    pfpCircle_width = parseInt(pfpCircle_width);

    const ctx = canvas.getContext("2d");

    const pfpRadius = 130 * getValue("pfp_size");
    const cardPfpX = getValue("pfp_positionX") - pfpRadius;
    const cardPfpY = getValue("pfp_positionY") - pfpRadius;

    ctx.save();
    ctx.beginPath();
    ctx.arc(pfpRadius + cardPfpX, pfpRadius + cardPfpY, pfpRadius + pfpCircle_width, 0, 360);
    ctx.strokeStyle = pfpCircle_color;
    ctx.lineWidth = pfpCircle_width * 2;
    ctx.stroke();
    ctx.restore();
}