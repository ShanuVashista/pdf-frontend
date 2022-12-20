import React, {RefObject} from 'react';
import {Dimmer} from 'semantic-ui-react';
import {Div} from '../ui/components/Div';
import {ConfirmContent} from './ConfirmContent';
import {IconButton} from "@material-ui/core";
import {Move, Trash} from "react-feather";

const ADJUSTERS_DIMENSIONS = 20;

interface Props {
    path?: string;
    stroke?: string;
    width: number;
    height: number;
    strokeWidth?: number;
    positionTop: number;
    positionLeft: number;
    dimmerActive: boolean;
    cancelDelete: () => void;
    deleteDrawing: () => void;
    onClick: () => void;
    scale: number;
    svgRef: RefObject<SVGSVGElement>;
    handleMouseDown: DragEventListener<HTMLDivElement>;
    handleMouseUp: DragEventListener<HTMLDivElement>;
    handleMouseMove: DragEventListener<HTMLDivElement>;
    handleMouseOut: DragEventListener<HTMLDivElement>;
    handleDrawingScale: DragEventListener<HTMLDivElement>;
}

export const Drawing: React.FC<Props> = (
    {
        dimmerActive,
        cancelDelete,
        deleteDrawing,
        positionTop,
        positionLeft,
        width,
        height,
        svgRef,
        path,
        stroke,
        scale,
        strokeWidth,
        handleMouseDown,
        handleMouseMove,
        handleMouseOut,
        handleMouseUp,
        handleDrawingScale,
        onClick,
    }
) => {
    return (
        <div>
            <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseOut={handleMouseOut}
                style={{
                    position: 'absolute',
                    top: positionTop,
                    left: positionLeft,
                    width: width,
                    height: height,
                    borderStyle: 'dashed',
                    borderWidth: 1,
                    borderColor: 'grey',
                    cursor: 'move',
                }}
            >
                <div style={{position: 'absolute', top: -12, left: -8}}>
                    <Move size={15}/>
                </div>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'whitesmoke',
                    zIndex: 9,
                    borderRadius: '50%'
                }}>
                    <IconButton onClick={onClick}>
                        <Trash size={15}/>
                    </IconButton>
                </div>
                <Dimmer.Dimmable as={Div} dimmed={dimmerActive}>
                    <svg ref={svgRef}>
                        <path
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            stroke={stroke}
                            fill="none"
                            d={path}
                            scale={scale}
                        />
                    </svg>
                    <Dimmer active={dimmerActive} onClickOutside={cancelDelete}>
                        <ConfirmContent
                            title="Delete?"
                            onConfirm={deleteDrawing}
                            onDismiss={cancelDelete}
                        />
                    </Dimmer>
                </Dimmer.Dimmable>
                <div
                    data-direction="top-left"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleDrawingScale}
                    style={{
                        position: 'absolute',
                        cursor: 'nwse-resize',
                        top: -12,
                        left: -8,
                        width: ADJUSTERS_DIMENSIONS,
                        height: ADJUSTERS_DIMENSIONS,
                    }}
                />
            </div>
        </div>
    );
};
