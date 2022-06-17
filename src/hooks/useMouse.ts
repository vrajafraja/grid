import { useState } from "react";
import { useEventListener } from "usehooks-ts";
import { Point } from "../types";

const useMouse = () => {
    const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    useEventListener('mousemove', (event) => {
        if (true || isMouseDown) {
            const { x, y } = event;
            setMousePos({ x, y })
        }
    })

    useEventListener('mousedown', (event) => {
        setIsMouseDown(true);
    })
    useEventListener('mouseup', (event) => {
        setIsMouseDown(false);
    })

    return { mousePos, isMouseDown }
}

export default useMouse;