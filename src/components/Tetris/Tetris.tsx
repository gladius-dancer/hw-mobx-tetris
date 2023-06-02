import React, {useEffect, useRef} from 'react';
import {useTetris} from "./hooks/useTetris";
import {observer} from "mobx-react-lite";
import tetris from "../../store/tetris";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


const Tetris = observer(() => {
    const {
        createMatrix,
        newGame,
        keyListener,
        update
    } = useTetris();

    const canvasRef = useRef<any>(null);
    const nextCanvasRef = useRef<any>(null);

    useEffect(() => {
        tetris.canvas = canvasRef.current;
        tetris.next = nextCanvasRef.current;
        tetris.context = tetris.canvas.getContext('2d');
        tetris.nextContext = tetris.next.getContext('2d');
        tetris.arena = createMatrix(12, 20);
        update()
    }, [])

    useEffect(()=> {
        if(tetris.isGameStarted){
            tetris.context.scale(20, 20);
            tetris.nextContext.scale(30, 30);
        }
    },[tetris.isGameStarted])


    return (
        <div className="wrapper" onKeyDown={keyListener} onKeyUp={keyListener}>
            <div className="tetris-inner">
                <div className="detailsLeft">
                    <div className="score">Score: 0</div>
                    <div className="level">Lavel: 0</div>
                    <div className="highScores"></div>
                </div>
                <canvas ref={canvasRef} className="tetris" width="240" height="400"></canvas>
                <div className="detailsRight">
                    <canvas ref={nextCanvasRef} className="next" width="160" height="160"></canvas>
                    <div className="controls">
                        <p><ArrowBackIcon fontSize="small"/> Move Left</p>
                        <p><ArrowForwardIcon fontSize="small"/> Move Right</p>
                        <p><ArrowDownwardIcon fontSize="small"/> Move Down</p>
                        <p><ArrowUpwardIcon fontSize="small"/> Rotate Right</p>
                        <p><span>Q</span> Rotate Left</p>
                        <p><span>W</span> Rotate Right</p>
                        <p><span>Esc</span> Pause Game</p>
                    </div>
                </div>
            </div>
            <div className="new-game-modal">
                <button onClick={newGame}>New game</button>
            </div>


        </div>
    );
})

export default Tetris;