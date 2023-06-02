import {makeAutoObservable} from "mobx";
import {Player} from "../models/Player";


class Tetris {

    pause = true;
    dropCounter = 0;
    DROP_FAST = 50;

    arena: any | null = null;
    nextArena: any | null = null;
    canvas: any | null = null;
    next: any | null = null;
    context: any | null = null;
    nextContext: any | null = null;
    isGameStarted: boolean = false;


    player: Player = {
        pos: {x: 0, y: 0},
        matrix: [],
        score: 0,
        level: 1,
        dropInterval: 1000,
        DROP_SLOW: 100,
        next: null,
    };
    colors = [
        null,
        "#03A9F4", //I
        "#9C27B0", //J
        "#FFC107", //L
        "#E91E63", //O
        "#00BCD4", //S
        "#8BC34A", //T
        "#3F51B5", //Z
    ];


    constructor() {
        makeAutoObservable(this);
    }


}

export default new Tetris();