import { useEffect, useMemo, useRef, useState } from 'react';
import { useWindowSize, useEventListener, useInterval } from 'usehooks-ts'

type Point = {
  x: number,
  y: number,
  color?: string,
}

const SPACING = 100;

function Grid() {
  const { width, height } = useWindowSize()
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);

  const [randomPoints, setRandomPoints] = useState<Array<Point>>([]);

  const points = useMemo(() => {
    const pointsArray = new Array<Array<Point>>();
    for (let y = 0; y < height; y += SPACING) {
      const pointsRow = new Array<Point>();
      for (let x = 0; x < width; x += SPACING) {
        pointsRow.push({ x: y / SPACING % 2 === 0 ? x : x + SPACING / 2, y });
        pointsRow.push({ x, y });
      }
      pointsArray.push(pointsRow);
    }
    return pointsArray;
  }, [width, height]);

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

  const drawPoly = (ctx: CanvasRenderingContext2D, points: Array<Point>, color: string) => {
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

  const drawPoint = (ctx: CanvasRenderingContext2D, point: Point) => {
    ctx.fillStyle = point.color || '#ffffff12';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  const findNearestMousePointCoordinates = (points: Array<Array<Point>>, mousePos: Point): Point => {
    const { x, y } = mousePos;
    const mousePosPoint = { x: Math.round(x / SPACING), y: Math.round(y / SPACING) };

    points.forEach(row => row.forEach(p => p.color = undefined));
    // const point = points && points[mousePosPoint.y][mousePosPoint.x];
    // return point;
    return { x: mousePosPoint.x, y: mousePosPoint.y };
  }



  useInterval(() => {
    points.forEach(row => row.forEach(p => { p.x += (Math.random() - 0.5) * 1; p.y += (Math.random() - 0.5) * 1 }));
    setIndex(index + 1);
  }, 0.1);


  useInterval(() => {
    const randomPoint = points[Math.round(Math.random() * height / SPACING)][Math.round(Math.random() * width / SPACING)]
    setRandomPoints((old) => {
      old?.push(randomPoint);
      return old;
    });
  }, 1500);

  useInterval(() => {
    setRandomPoints((old) => {
      old?.shift();
      return old;
    });
  }, Math.random() * 2500);


  useEffect(() => {
    const getPointNeighbours = (coordinates: Point, points: Array<Array<Point>>): Array<Point> => {
      const neighbours = new Array<Point>();
      let neighbour: Point;

      if (coordinates.y > 0) {
        neighbour = points[coordinates.y - 1][coordinates.x - 1];
        if (neighbour) {
          neighbours.push(neighbour);
        }
        neighbour = points[coordinates.y - 1][coordinates.x];
        if (neighbour) {
          neighbours.push(neighbour);
        }
        neighbour = points[coordinates.y - 1][coordinates.x + 1];
        if (neighbour) {
          neighbours.push(neighbour);
        }
      }
      neighbour = points[coordinates.y][coordinates.x - 1];
      if (neighbour) {
        neighbours.push(neighbour);
      }
      neighbour = points[coordinates.y][coordinates.x + 1];
      if (neighbour) {
        neighbours.push(neighbour);
      }
      if (coordinates.y < Math.round(height / SPACING)) {
        neighbour = points[coordinates.y + 1][coordinates.x - 1];
        if (neighbour) {
          neighbours.push(neighbour);
        }
        neighbour = points[coordinates.y + 1][coordinates.x];
        if (neighbour) {
          neighbours.push(neighbour);
        }
        neighbour = points[coordinates.y + 1][coordinates.x + 1];
        if (neighbour) {
          neighbours.push(neighbour);
        }

      }
      return neighbours;
    }

    const drawPolygons = (ctx: CanvasRenderingContext2D, points: Array<Point>, centerPoint: Point): void => {
      if (points.length === 8) {
        drawPoly(ctx, [points[0], points[1], centerPoint], '#fffff005');
        drawPoly(ctx, [points[1], points[2], centerPoint], '#fffff005');
        drawPoly(ctx, [points[0], points[3], centerPoint], '#fffff005');
        drawPoly(ctx, [points[2], points[4], centerPoint], '#fffff005');
        drawPoly(ctx, [points[3], points[5], centerPoint], '#fffff005');
        drawPoly(ctx, [points[5], points[6], centerPoint], '#fffff005');
        drawPoly(ctx, [points[4], points[7], centerPoint], '#fffff005');
        drawPoly(ctx, [points[6], points[7], centerPoint], '#fffff005');
      }
    }
    const drawPolygonsAroundPoint = (ctx: CanvasRenderingContext2D, mousePos: Point): void => {
      const nearestMousePointCoordinates = findNearestMousePointCoordinates(points, mousePos);
      try {
        const mousePoint = points[nearestMousePointCoordinates.y][nearestMousePointCoordinates.x];
        mousePoint.color = '#ff3333';
        const neighbours = getPointNeighbours(nearestMousePointCoordinates, points);
        drawPolygons(ctx, neighbours, mousePos);
      } catch (e) {
        console.log(e);
      }
    }

    if (canvasRef.current) {
      // const points = [{ x: 200, y: 200 }, { x: width - 200, y: 200 }, { x: width - 200, y: height - 200 }, { x: 200, y: height - 200 }];
      const { x, y } = mousePos;
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      let ctx = canvasCtxRef.current;
      if (!ctx) {
        return;
      }
      if (!points.length) {
        return;
      }
      ctx.clearRect(0, 0, width, height);
      drawPoint(ctx, mousePos);
      points.forEach(row => row.forEach(p => { drawPoint(ctx!, p) }));


      drawPolygonsAroundPoint(ctx, mousePos);

      if (randomPoints.length) {
        randomPoints.map(p => {
          drawPolygonsAroundPoint(ctx!, p);
        })
      }


    }
  }, [points, mousePos, height, width, index, randomPoints]);


  return (
    <div className="App">
      <canvas ref={canvasRef} width={width} height={height}></canvas>
    </div>
  );
}

export default Grid;
