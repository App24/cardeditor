async function drawPfp(canvas, data) {
    const { pfp_size, pfp_positionX, pfp_positionY } = data;
    let { pfp_image } = data;

    if (pfp_image.endsWith(".gif")) {
        pfp_image = pfp_image.substring(0, pfpImage.length - 3);
        pfp_image += "png";
    }

    const ctx = canvas.getContext("2d");

    const userAvatar = await loadImage(pfp_image);

    const pfpRadius = 130 * pfp_size;
    const cardPfpX = pfp_positionX - pfpRadius;
    const cardPfpY = pfp_positionY - pfpRadius;

    ctx.save();
    ctx.beginPath();
    ctx.arc(pfpRadius + cardPfpX, pfpRadius + cardPfpY, pfpRadius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    if (userAvatar)
        ctx.drawImage(userAvatar, cardPfpX, cardPfpY, pfpRadius * 2, pfpRadius * 2);
    ctx.restore();
}