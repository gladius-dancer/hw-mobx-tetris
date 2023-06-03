import React from 'react';
import {Button} from "@mui/material";
import "./NewGameModal.scss";

type ModalType = {
    newGame: () => void
}

function NewGameModal({newGame}: ModalType) {
    return (
        <div className='new-game'>
            <h1>Welcome!</h1>
            <Button variant="contained" onClick={newGame}>New game</Button>
        </div>
    );
}

export default NewGameModal;