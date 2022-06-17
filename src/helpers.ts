import { Point } from "./types";

export const drawPoint = (ctx: CanvasRenderingContext2D, point: Point) => {
    ctx.fillStyle = point.color || '#ffffff12';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
    ctx.fill();
}

export const drawPoly = (ctx: CanvasRenderingContext2D, points: Array<Point>, color: string) => {
    ctx.fillStyle = color;

    ctx.strokeStyle = '#aaaaff12';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

export const drawPolygons = (ctx: CanvasRenderingContext2D, points: Array<Point>, centerPoint: Point): void => {
    if (points.length === 8) {
        drawPoly(ctx, [points[0], points[1], centerPoint], '#fffff005');
        drawPoly(ctx, [points[1], points[2], centerPoint], '#ffffa005');
        drawPoly(ctx, [points[0], points[3], centerPoint], '#fffff005');
        drawPoly(ctx, [points[2], points[4], centerPoint], '#ffffa005');
        drawPoly(ctx, [points[3], points[5], centerPoint], '#fffff005');
        drawPoly(ctx, [points[5], points[6], centerPoint], '#ffffa005');
        drawPoly(ctx, [points[4], points[7], centerPoint], '#fffff005');
        drawPoly(ctx, [points[6], points[7], centerPoint], '#fffaa005');
    }
}

export const getDirections = (targetX: number, targetY: number, mouseX: number, mouseY: number): [number, number] => {
    const dx = targetX - mouseX;
    const dy = targetY - mouseY;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    if (distance === 0) {
        return [0, 0];
    } else {
        const directionX = dx / distance;
        const directionY = dy / distance;
        return [directionX, directionY];
    }
}