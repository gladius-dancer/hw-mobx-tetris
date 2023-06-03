import React from 'react';
import './App.css';
import Tetris from "./components/Tetris/Tetris";
import Modal from "react-modal";

Modal.setAppElement("#root");


function App() {
  return (
    <div className="App" >
     <Tetris/>
    </div>
  );
}

export default App;
