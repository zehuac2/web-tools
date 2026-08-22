import { type FC, useRef, useEffect, useState, memo } from 'react';
import { css } from 'styled-system/css';

import useBehaviorSubject from '@/hooks/react/useBehaviorSubject';
import { Papers } from '@/tools/grid-maker/papers';
import { type Inch, type Pixel, inchToPixel } from '@/tools/grid-maker/units';
import { useEvents } from '@/tools/grid-maker/contexts/EventsContext';
import InvalidConfiguration from './InvalidConfiguration';
import { getGridFont, getGridLineVariable, getGridTextVariable } from './theme';

export interface GridProps {
  className?: string;
}

export interface GridDimensions {
  readonly width: Inch;
  readonly height: Inch;
  readonly pixelWidth: Pixel;
  readonly pixelHeight: Pixel;
  readonly pixelCellSize: Pixel;
  readonly colCount: number;
  readonly rowCount: number;
}

export function calculateGridDimensions(
  paperKey: keyof typeof Papers,
  cellSize: Inch,
): GridDimensions {
  const paper = Papers[paperKey];
  const pixelWidth = inchToPixel(paper.width);
  const pixelHeight = inchToPixel(paper.height);
  const pixelCellSize = inchToPixel(cellSize);

  return {
    width: paper.width,
    height: paper.height,
    pixelWidth,
    pixelHeight,
    pixelCellSize,
    colCount: pixelCellSize > 0 ? Math.floor(pixelWidth / pixelCellSize) : 0,
    rowCount: pixelCellSize > 0 ? Math.floor(pixelHeight / pixelCellSize) : 0,
  };
}

function drawGridLines(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize: number,
  lineWidth: number,
  lineColor: string,
): void {
  context.beginPath();
  context.strokeStyle = lineColor;
  context.lineWidth = lineWidth;

  for (let x = cellSize; x < width; x += cellSize) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }

  for (let y = cellSize; y < height; y += cellSize) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }

  context.stroke();
}

function drawGridTexts(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize: number,
  fontSize: number,
  textColor: string,
  font: string,
): void {
  context.fillStyle = textColor;
  context.font = `${fontSize}px ${font}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  const xCellCount = Math.ceil(width / cellSize);
  const yCellCount = Math.ceil(height / cellSize);

  const textOffset = Math.floor(cellSize / 2);

  for (let x = 0; x < xCellCount; x++) {
    for (let y = 0; y < yCellCount; y++) {
      const xTextOffset = textOffset + x * cellSize;
      const yTextOffset = textOffset + y * cellSize;

      context.fillText(`${x},${y}`, xTextOffset, yTextOffset, cellSize);
    }
  }
}

const Grid: FC<GridProps> = ({ className }) => {
  const { paperKey$, cellSize$, fontSize$ } = useEvents();

  const paperKey = useBehaviorSubject(paperKey$);
  const cellSize = useBehaviorSubject(cellSize$);
  const fontSize = useBehaviorSubject(fontSize$);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderResult, setRenderResult] = useState('');
  const { width, height, pixelWidth, pixelHeight, pixelCellSize } =
    calculateGridDimensions(paperKey, cellSize);
  const alt = `A grid whose width is ${width} inches, and whose height is ${height} inches`;
  const dpr = window.devicePixelRatio;
  const renderWidth = pixelWidth * dpr;
  const renderHeight = pixelHeight * dpr;
  const renderCellSize = pixelCellSize * dpr;
  const renderFontSize = fontSize * dpr;

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const context = canvasRef.current.getContext('2d');
    const computedStyle = window.getComputedStyle(canvasRef.current);

    if (!context) {
      return;
    }

    const renderLineWidth = dpr;

    context.clearRect(0, 0, renderWidth, renderHeight);

    context.fillStyle = 'white';
    context.fillRect(0, 0, renderWidth, renderHeight);

    drawGridLines(
      context,
      renderWidth,
      renderHeight,
      renderCellSize,
      renderLineWidth,
      computedStyle.getPropertyValue(getGridLineVariable()),
    );

    drawGridTexts(
      context,
      renderWidth,
      renderHeight,
      renderCellSize,
      renderFontSize,
      computedStyle.getPropertyValue(getGridTextVariable()),
      getGridFont(),
    );

    const animationFrame = requestAnimationFrame(() => {
      if (!canvasRef.current) {
        return;
      }

      setRenderResult(canvasRef.current.toDataURL());
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      context.clearRect(0, 0, renderWidth, renderHeight);
    };
  }, [renderWidth, renderHeight, renderCellSize, renderFontSize, dpr]);

  if (pixelCellSize <= 0) {
    // Zero cellSize would cause a massive grid
    return <InvalidConfiguration />;
  }

  return (
    <>
      {/*
      Canvas' 2d drawing context operates in a device pixel ratio that is
      independent of the device pixel ratio of the viewport. Therefore, we
      must render the grid into a size that is visually suitable for display,
      and then scale it down to the actual size.
      */}
      <canvas
        className={css({ display: 'none' })}
        ref={canvasRef}
        width={renderWidth}
        height={renderHeight}
      ></canvas>
      {renderResult && (
        <img
          className={className}
          width={pixelWidth}
          height={pixelHeight}
          src={renderResult}
          alt={alt}
        />
      )}
    </>
  );
};

Grid.displayName = 'Grid';

export default memo(Grid);
