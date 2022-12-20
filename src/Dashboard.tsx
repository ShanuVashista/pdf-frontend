import React, {useEffect, useRef, useState} from "react";
import {ReactStateDeclaration} from "@uirouter/react";
import {Grid} from "@material-ui/core";
import SignatureCanvas from 'react-signature-canvas'

export function Dashboard() {
    const sigCanvas = useRef<any>()
    const [imageURL, setImageURL] = useState(null);
    const [canvasWidth, setCanvasWidth] = useState(200);
    const [canvasHeight, setCanvasHeight] = useState(70);
    const [mouseDown, setMouseDown] = useState(false);
    const [resizeStart, setResizeStart] = useState(false);
    const create = () => {
        const URL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
        setImageURL(URL);
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    const isClicked = useRef<boolean>(false);

    const coords = useRef<{
        startX: number,
        startY: number,
        lastX: number,
        lastY: number
    }>({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    })

    useEffect(() => {
        if (!boxRef.current || !containerRef.current) return;

        const box = boxRef.current;
        const container = containerRef.current;


        const onMouseDown = (e: MouseEvent) => {
            isClicked.current = true;
            coords.current.startX = e.clientX;
            coords.current.startY = e.clientY;
            setMouseDown(true);
        }

        const onMouseUp = (e: MouseEvent) => {
            isClicked.current = false;
            setMouseDown(false);
            coords.current.lastX = box.offsetLeft;
            coords.current.lastY = box.offsetTop;
        }

        const onMouseMove = (e: MouseEvent) => {
            if (!isClicked.current) return;
            const nextX = e.clientX - coords.current.startX + coords.current.lastX;
            const nextY = e.clientY - coords.current.startY + coords.current.lastY;
            if (!resizeStart) {
                box.style.top = `${nextY < 0 ? 0 : nextY < 700 ? nextY : 700}px`;
                box.style.left = `${nextX < 0 ? 0 : nextX < 400 ? nextX : 400}px`;
            }
        }

        box.addEventListener('mousedown', onMouseDown);
        box.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseleave', onMouseUp);

        const cleanup = () => {
            box.removeEventListener('mousedown', onMouseDown);
            box.removeEventListener('mouseup', onMouseUp);
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseleave', onMouseUp);
        }

        return cleanup;
    }, [])

    const handleImageScale = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (mouseDown) {
            setResizeStart(true);
            setCanvasWidth(canvasWidth + event.movementX);
            setCanvasHeight(canvasHeight + event.movementY);
        }
        setResizeStart(false);
    };

    return (
        <Grid style={{width: "100%"}}>
            <SignatureCanvas penColor="black" canvasProps={{className: "sigCanvas"}} ref={sigCanvas}/>
            <button className="create" onClick={create}>
                Create
            </button>
            <div ref={containerRef} className="container" style={{height: 400, width: 400, position: "relative"}}>
                <div ref={boxRef} className={"position-absolute"}>
                    {
                        imageURL && (
                            <>
                                <img src={imageURL} alt="signature" className="signature"
                                     style={{pointerEvents: "none", width: canvasWidth, height: canvasHeight}}/>
                            </>
                        )
                    }
                    <div
                        data-direction="top-left"
                        onMouseMove={handleImageScale}
                        style={{
                            position: 'absolute',
                            cursor: 'nwse-resize',
                            top: -12,
                            left: -8,
                            width: 20,
                            height: 20,
                        }}
                    />
                </div>
            </div>

        </Grid>
    );
}

export const states: ReactStateDeclaration[] = [
    {
        url: "/dashboard",
        name: "dashboard",
        data: {
            title: "Dashboard",
            loggedIn: true,
        },
        component: Dashboard,
    },
];
