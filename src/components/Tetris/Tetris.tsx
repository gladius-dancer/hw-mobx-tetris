import React, {useEffect, useRef} from 'react';
import {observer} from "mobx-react-lite";
import tetris from "../../store/tetris";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Modal from "../Modal/Modal";
import NewGameModal from "../NewGameModal/NewGameModal";
import ResumeGameModal from "../ResumeGameModal/ResumeGameModal";


const Tetris = observer(() => {

    const canvasRef = useRef<any>(null);
    const nextCanvasRef = useRef<any>(null);

    useEffect(() => {
        tetris.canvas = canvasRef.current;
        tetris.next = nextCanvasRef.current;
        tetris.context = tetris.canvas.getContext('2d');
        tetris.nextContext = tetris.next.getContext('2d');
        tetris.arena = tetris.createMatrix(12, 20);

        if (tetris.isGameStarted) {
            tetris.context.scale(20, 20);
            tetris.nextContext.scale(30, 30);
        }
    }, [tetris.isGameStarted])

    useEffect(() => {
        const body = document.body;

        body.addEventListener('keydown', tetris.keyListener);
        body.addEventListener('keyup', tetris.keyListener);

        return () => {
            body.removeEventListener('keydown', tetris.keyListener);
            body.removeEventListener('keyup', tetris.keyListener);
        }
    }, [])

    return (
        <div className="wrapper">
            <div className="tetris-inner">
                <div className="detailsLeft">
                    <div className="score">Score: {tetris.player.score}</div>
                    <div className="level">Lavel: {tetris.player.level}</div>
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
                        <p><span>Q </span> Rotate Left</p>
                        <p><span>W </span> Rotate Right</p>
                        <p><span>Esc </span> Pause Game</p>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={tetris.modal}
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div>
                    {tetris.gameOver ?
                        <NewGameModal newGame={tetris.newGame}/> :
                        <ResumeGameModal score={tetris.player.score} newGame={tetris.newGame}/>}
                </div>

            </Modal>
        </div>
    );
})

export default Tetris;