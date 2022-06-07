function drawRank(canvas, data) {
    const { rank_text, rank_textSize, rank_textAlign, rank_textBaseline, rank_strokeSize, rank_textColor, rank_strokeColor } = data;
    const { rank_positionX, rank_positionY } = data;

    const ctx = canvas.getContext("2d");

    const fontSize = 50 * rank_textSize;

    const lbPositionText = `Rank: #${rank_text}`;

    const x = parseInt(rank_positionX);
    const y = parseInt(rank_positionY) + getPositionDiff(fontSize, rank_textBaseline);

    ctx.textBaseline = rank_textBaseline;
    ctx.fillStyle = rank_textColor;
    ctx.font = `${fontSize}px ${CANVAS_FONT}`;
    ctx.textAlign = rank_textAlign;
    if (rank_strokeSize > 0) {
        ctx.strokeStyle = rank_strokeColor;
        ctx.lineWidth = rank_strokeSize;
        ctx.strokeText(lbPositionText, x, y);
    }
    ctx.fillText(lbPositionText, x, y);
}