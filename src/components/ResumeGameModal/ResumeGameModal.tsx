import React from 'react';
import {Button} from "@mui/material";
import "./ResumeGameModal.scss";

type ResumeGame = {
    score: number,
    newGame: () => void
}

function ResumeGameModal({score, newGame}: ResumeGame) {
    return (
        <div className="resume-game">
            <h1>Game Over</h1>
            <h3>Your score : {score}</h3>
            <Button variant="contained" onClick={newGame}>New game</Button>
        </div>
    );
}

export default ResumeGameModal;


