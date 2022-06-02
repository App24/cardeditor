function toggleXpBarOptions(element) {
    const value = element.value;

    {
        const options = document.querySelectorAll("[data-xpbaroption]");
        options.forEach(o => {
            o.classList.add("hidden");
            o.querySelectorAll(".updateCard").forEach(c => {
                if (c.dataset.nosave != "fixed")
                    c.dataset.nosave = "";
            });
        });
    }

    {
        const options = document.querySelectorAll(`[data-xpbaroption="${value}"]`);
        options.forEach(o => {
            o.classList.remove("hidden");
            o.querySelectorAll(".updateCard").forEach(c => {
                if (c.dataset.nosave != "fixed")
                    delete c.dataset.nosave;
            });
        });
    }
}

function drawXpBar(canvas, data) {
    const { xpBar_filled: filled, xpBar_startColor, xpBar_endColor, xpBar_type, xpBar_size, xpBar_height, xpBar_bar_align, xpBar_barColor } = data;
    let { xpBar_width, xpBar_positionX, xpBar_positionY, xpBar_round } = data;

    xpBar_positionX = parseInt(xpBar_positionX);
    xpBar_positionY = parseInt(xpBar_positionY);

    xpBar_width = parseInt(xpBar_width);

    const ctx = canvas.getContext("2d");

    const startRGB = hexToRGB(xpBar_startColor);
    const startHsl = rgbToHsl(startRGB.r, startRGB.g, startRGB.b);

    const endRGB = hexToRGB(xpBar_endColor);
    const endHsl = rgbToHsl(endRGB.r, endRGB.g, endRGB.b);

    switch (xpBar_type) {
        default:
        case "circle": {
            const pfpRadius = 130 * getValue("pfp_size");
            const cardPfpX = getValue("pfp_positionX") - pfpRadius;
            const cardPfpY = getValue("pfp_positionY") - pfpRadius;

            xpBar_positionX = pfpRadius + cardPfpX;
            xpBar_positionY = pfpRadius + cardPfpY;

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${blend(startHsl.h, endHsl.h, 1 - filled) * 360}, ${blend(startHsl.s, endHsl.s, 1 - filled) * 100}%, ${blend(startHsl.l, endHsl.l, 1 - filled) * 100}%, 1)`;
            ctx.lineWidth = xpBar_width * 2;
            ctx.arc(xpBar_positionX, xpBar_positionY, pfpRadius + xpBar_width, (Math.PI / 180) * 270, (Math.PI / 180) * (270 + (360 * filled)));
            ctx.stroke();
            ctx.restore();
        } break;
        case "bar": {
            xpBar_round /= 10;

            const barWidth = 600 * xpBar_size;
            const barHeight = 30 * xpBar_height;

            xpBar_positionX = xpBar_positionX - barWidth / 2;
            xpBar_positionY = xpBar_positionY - barHeight / 2;

            let filledBarX = xpBar_positionX;
            let filledBarY = xpBar_positionY;

            switch (xpBar_bar_align) {
                case "center": {
                    filledBarX += (barWidth / 2) - (barWidth * filled) / 2;
                } break;
                case "right": {
                    filledBarX += (barWidth) - (barWidth * filled);
                } break;
            }

            ctx.fillStyle = xpBar_barColor;
            ctx.save();
            roundRect(ctx, xpBar_positionX, xpBar_positionY, barWidth, barHeight, barHeight * xpBar_round);
            ctx.restore();

            ctx.fillStyle = `hsla(${blend(startHsl.h, endHsl.h, 1 - filled) * 360}, ${blend(startHsl.s, endHsl.s, 1 - filled) * 100}%, ${blend(startHsl.l, endHsl.l, 1 - filled) * 100}%, 1)`;
            ctx.save();
            roundRect(ctx, filledBarX, filledBarY, barWidth * filled, barHeight, barHeight * xpBar_round, "clip");
            ctx.fillRect(filledBarX, filledBarY, barWidth * filled, barHeight);
            ctx.restore();
        } break;
    }
}