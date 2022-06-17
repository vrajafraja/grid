export type Point = {
    x: number,
    y: number,
    color?: string,
}

export type MovingPoint = Point & {
    speed: number,
    maxSpeed: number,
    acceleration: number,
    weight: number,
    direction: [number, number],
}