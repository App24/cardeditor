import { CANVAS_FONT } from "./constants.mjs";

export async function asyncForEach(array, callbackFn) {
    for (let i = 0; i < array.length; i++) {
        const result = await callbackFn(array[i], i, array);
        if (result === true)
            return true;
    }
    return false;
}

export function roundRect(ctx, x, y, width, height, radius, func = "fill") {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    switch (func) {
        case "clip":
            ctx.clip();
            break;
        case "fill":
            ctx.fill();
            break;
        case "stroke":
            ctx.stroke();
            break;
    }
}

export function drawMaskedImage(mask, image, globalCompositeOperation) {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(mask, 0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = globalCompositeOperation;

    ctx.drawImage(image, 0, 0);

    return canvas;
}

export function checkIfFileExists(url) {
    try {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status != 404;
    } catch {
        return false;
    }
}

export async function getImageFromBlob(blob) {
    return new Promise((resolve) => {
        const image = new Image();

        image.onload = () => {
            resolve(image);
        }

        image.src = URL.createObjectURL(blob);
    });
}

export function createCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

export async function loadImage(path) {
    if (!checkIfFileExists(path)) return;

    const blob = await fetch(path).then(res => res.blob());
    return getImageFromBlob(blob);
}

export function getPositionDiff(fontSize, textBaseline) {
    switch (textBaseline) {
        case "top":
            return 0.3833333333333333 * fontSize;
        case "hanging":
            return 0.2333333333333333 * fontSize;
        case "middle":
            return 0.1666666666666667 * fontSize;
        default:
        case "alphabetic":
            return 0;
        case "ideographic":
            return 1.4 * fontSize;
        case "bottom":
            return -0.05 * fontSize;
    }
}

export function fitTextOnCanvas(ctx, text, width, startSize = 100) {
    let fontsize = startSize;

    const prevFont = ctx.font;

    ctx.font = `${fontsize}px ${CANVAS_FONT}`;

    do {
        fontsize--;
        ctx.font = `${fontsize}px ${CANVAS_FONT}`;
    } while (ctx.measureText(text).width > width);

    ctx.font = prevFont;

    return fontsize;

}

export function hexToRGB(hex) {
    const result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function rgbToHex(color) {
    return ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
}

export function blend(a, b, w) {
    return (a * w) + (b * (1 - w));
}

export function blendRGB(colorA, colorB, w) {
    return {
        r: blend(colorA.r, colorB.r, w),
        g: blend(colorA.g, colorB.g, w),
        b: blend(colorA.b, colorB.b, w)
    };
}

export function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return {
        h,
        s,
        l
    };
}