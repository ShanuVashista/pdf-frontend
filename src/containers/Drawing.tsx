import React, {createRef, useEffect, useState} from 'react';
import {DragActions} from '../entities';
import {getMovePosition} from '../utils/helpers';
import {Drawing as DrawingComponent} from '../components/Drawing';

interface Props {
    pageWidth: number;
    pageHeight: number;
    removeDrawing: () => void;
    updateDrawingAttachment: (drawingObject: Partial<DrawingAttachment>) => void;
}

export const Drawing = ({
                            x,
                            y,
                            width,
                            height,
                            stroke,
                            strokeWidth,
                            path,
                            pageWidth,
                            pageHeight,
                            removeDrawing,
                            updateDrawingAttachment,
                        }: DrawingAttachment & Props) => {
    const svgRef = createRef<SVGSVGElement>();
    const [mouseDown, setMouseDown] = useState(false);
    const [positionTop, setPositionTop] = useState(y);
    const [positionLeft, setPositionLeft] = useState(x);
    const [canvasWidth, setCanvasWidth] = useState(width);
    const [direction, setDirection] = useState<string[]>([]);
    const [canvasHeight, setCanvasHeight] = useState(height);
    const [operation, setOperation] = useState<DragActions>(
        DragActions.NO_MOVEMENT
    );
    const [dimmerActive, setDimmerActive] = useState(false);

    useEffect(() => {
        const svg = svgRef.current;
        if (svg) {
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        }
    }, [svgRef, width, height]);

    const handleMousedown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setMouseDown(true);
        setOperation(DragActions.MOVE);
        const directions = event.currentTarget.dataset.direction;
        if (directions) {
            setDirection(directions.split('-'));
            setOperation(DragActions.SCALE);
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (mouseDown) {
            const {top, left} = getMovePosition(
                positionLeft,
                positionTop,
                event.movementX,
                event.movementY,
                width,
                height,
                pageWidth,
                pageHeight
            );
            setPositionTop(top);
            setPositionLeft(left);
        }
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setMouseDown(false);

        if (operation === DragActions.MOVE) {
            const {top, left} = getMovePosition(
                positionLeft,
                positionTop,
                event.movementX,
                event.movementY,
                width,
                height,
                pageWidth,
                pageHeight
            );

            updateDrawingAttachment({
                x: left,
                y: top,
            });
        }

        if (operation === DragActions.SCALE) {
            updateDrawingAttachment({
                x: positionLeft,
                y: positionTop,
            });
        }

        setOperation(DragActions.NO_MOVEMENT);
    };

    const handleMouseOut = (event: React.MouseEvent<HTMLDivElement>) => {
        if (operation === DragActions.MOVE) {
            handleMouseUp(event);
        }
    };

    const handleImageScale = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (mouseDown) {
            if (direction.includes('left')) {
                setPositionLeft(positionLeft + event.movementX);
                setCanvasWidth(canvasWidth - event.movementX);
            }

            if (direction.includes('top')) {
                setPositionTop(positionTop + event.movementY);
                setCanvasHeight(canvasHeight - event.movementY);
            }

            if (direction.includes('right')) {
                setCanvasWidth(canvasWidth + event.movementX);
            }

            if (direction.includes('bottom')) {
                setCanvasHeight(canvasHeight + event.movementY);
            }
        }
    };

    const handleClick = () => setDimmerActive(true);
    const cancelDelete = () => setDimmerActive(false);

    const confirmDelete = () => {
        cancelDelete();
        removeDrawing();
    };
    return (
        <DrawingComponent
            stroke={stroke}
            strokeWidth={strokeWidth}
            path={path}
            width={canvasWidth}
            svgRef={svgRef}
            height={canvasHeight}
            onClick={handleClick}
            cancelDelete={cancelDelete}
            dimmerActive={dimmerActive}
            deleteDrawing={confirmDelete}
            handleMouseDown={handleMousedown}
            handleMouseMove={handleMouseMove}
            handleMouseOut={handleMouseOut}
            handleMouseUp={handleMouseUp}
            positionLeft={positionLeft}
            positionTop={positionTop}
            handleDrawingScale={handleImageScale}
        />
    );
};
