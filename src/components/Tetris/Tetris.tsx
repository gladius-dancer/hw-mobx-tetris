import React, {useEffect, useRef} from 'react';
import {useTetris} from "./hooks/useTetris";
import {observer} from "mobx-react-lite";
import tetris from "../../store/tetris";

const Tetris = observer(() => {
    const {
        createMatrix,
        newGame
    } = useTetris();
    const canvasRef = useRef<any>(null);
    const nextCanvasRef = useRef<any>(null);
    useEffect(() => {
        tetris.canvas = canvasRef.current;
        tetris.next = nextCanvasRef.current;
        tetris.context = tetris.canvas.getContext('2d');
        tetris.nextContext = tetris.next.getContext('2d');
        tetris.context.scale(20, 20);
        tetris.nextContext.scale(30, 30);

        tetris.arena = createMatrix(12, 20);

        newGame()

    }, [])


    return (
        <div className="wrapper">
            <div className="detailsLeft">
                <div className="score"></div>
                <div className="level"></div>
                <div className="highScores"></div>
            </div>
            <canvas ref={canvasRef} className="tetris" width="240" height="400"></canvas>
            <div className="detailsRight">
                <canvas ref={nextCanvasRef} className="next" width="160" height="160"></canvas>
                <div className="controls">
                    <p><i className="fas fa-arrow-left"></i> Move Left
                    </p>
                    <p><i className="fas fa-arrow-right"></i> Move Right</p>
                    <p><i className="fas fa-arrow-down"></i> Move Down
                    </p>
                    <p><i className="fas fa-arrow-up"></i> Rotate Right</p>
                    <p><span>Q</span> Rotate Left</p>
                    <p><span>W</span> Rotate Right</p>
                    <p><span>Esc</span> Pause Game</p>
                </div>
            </div>
        </div>
    );
})

export default Tetris;