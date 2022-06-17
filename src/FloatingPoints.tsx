import { useCallback, useEffect, useRef, useState } from "react";
import { useInterval, useWindowSize } from "usehooks-ts";
import { drawPoint, drawPolygons, getDirections } from "./helpers";
import useMouse from "./hooks/useMouse";
import { MovingPoint } from "./types";

const FRICTION = .15;

const DEFAULT_POINT: MovingPoint = {
    x: 500,
    y: 500,
    speed: 0,
    maxSpeed: 0,
    acceleration: 0,
    direction: [0, 0],
    weight: 0,
}

const pointColors = ['#aaccdd', '#ddaacc', '#ccddee', '#aabbaa', '#bbaaaa', '#aabbcc', '#ddccaa', '#aaddee', '#eeddaa', '#ccaabb'];

const FloatingPoints = () => {
    const { width, height } = useWindowSize();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const lastTimestampRef = useRef<number>(new Date().getTime());
    const fpsRef = useRef<number>(0);

    const { mousePos, isMouseDown } = useMouse();

    const [floatingPoints, setFloatingPoints] = useState<Array<MovingPoint>>(new Array(3500).fill(DEFAULT_POINT).map((point) => ({ ...point, color: pointColors[Math.floor(Math.random() * pointColors.length)]})));


    useEffect(() => {
        if (canvasRef.current) {
            canvasCtxRef.current = canvasRef.current.getContext('2d');
        }
    }, [canvasRef]);

    const draw = useCallback(() => {
        if (canvasCtxRef.current) {
            canvasCtxRef.current.clearRect(0, 0, width, height);
            canvasCtxRef.current.font = "16px Arial";
            canvasCtxRef.current.fillStyle = "red";
            canvasCtxRef.current.fillText(`${fpsRef.current} FPS`, 10, 26);
            floatingPoints.forEach((floatingPoint) => drawPoint(canvasCtxRef.current!, floatingPoint));
            drawPolygons(canvasCtxRef.current, [
                floatingPoints[0],
                floatingPoints[1],
                floatingPoints[2],
                floatingPoints[3],
                floatingPoints[4],
                floatingPoints[5],
                floatingPoints[6],
                floatingPoints[7],
            ], isMouseDown ? mousePos : floatingPoints[8]);
        }
    }, [width, height, floatingPoints, isMouseDown, mousePos]);

    const updatePoints = useCallback(() => {
        setFloatingPoints((currentPoints) => (
            currentPoints.map((currentPoint) => {
                let { x, y, speed, maxSpeed, acceleration, direction, weight } = currentPoint;
                if ((speed + acceleration) < maxSpeed) {
                    speed += acceleration;
                } else if (speed === maxSpeed) {
                    acceleration = -FRICTION / weight;
                } else {
                    speed = maxSpeed;
                }
                if (speed <= 0) {
                    acceleration = Math.sqrt(Math.random() / 5);
                    maxSpeed = Math.round(Math.random() * 5);
                    direction = isMouseDown
                        ? getDirections(mousePos.x, mousePos.y, x, y)
                        : [Math.random() - 0.5, Math.random() - 0.5];
                    weight = 5 + Math.random() * 5;
                }
                x += direction[0] * speed;
                y += direction[1] * speed;

                if (x < 0 || x > width) {
                    direction[0] *= -1;
                }
                if (y < 0 || y > height) {
                    direction[1] *= -1;
                }
                return { ...currentPoint, x, y, speed, maxSpeed, acceleration, direction, weight }
            })));
    }, [height, isMouseDown, mousePos.x, mousePos.y, width]);

    useInterval(() => {
        const now = new Date().getTime();
        if (now - lastTimestampRef.current > 16) {
            updatePoints();
            fpsRef.current = Math.round(1000 / (now - lastTimestampRef.current));
            lastTimestampRef.current = now;
        };
    }, 0);

    useEffect(() => {
        draw();
    }, [draw, floatingPoints]);

    return (
        <div className="App">
            <canvas ref={canvasRef} width={width} height={height}></canvas>
        </div>
    );
};

export default FloatingPoints;