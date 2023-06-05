import {makeAutoObservable} from "mobx";
import {Player} from "../models/Player";
import {Matrix} from "../models/Matrix";

class Tetris {
    pause: boolean = true;
    dropCounter: number = 0;
    DROP_FAST: number = 50;
    lastTime: number = 0;
    arena: any | null = null;
    canvas: any | null = null;
    next: any | null = null;
    context: any | null = null;
    nextContext: any | null = null;
    isGameStarted: boolean = false;
    modal: boolean = true;
    gameOver: boolean = true;

    player: Player = {
        pos: {x: 0, y: 0},
        matrix: [],
        score: 0,
        level: 1,
        dropInterval: 1000,
        DROP_SLOW: 100,
        next: null,
    };
    colors:string[] = [

        "#03A9F4",
        "#03A9F4",
        "#9C27B0",
        "#FFC107",
        "#E91E63",
        "#00BCD4",
        "#8BC34A",
        "#3F51B5",
    ];

    constructor() {
        makeAutoObservable(this);
    }

    showModal = () => {
        this.modal = true;
    }

    hideModal = () => {
        this.modal = false;
    }

    createMatrix = (w: number, h: number) => {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }

    nextArena = this.createMatrix(6, 6);

    createPiece(type: string) {
        if (type === "I") {
            return [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ];
        } else if (type === "J") {
            return [
                [0, 2, 0],
                [0, 2, 0],
                [2, 2, 0],
            ];
        } else if (type === "L") {
            return [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3],
            ];
        } else if (type === "O") {
            return [
                [4, 4],
                [4, 4],
            ];
        } else if (type === "S") {
            return [
                [0, 5, 5],
                [5, 5, 0],
                [0, 0, 0],
            ];
        } else if (type === "T") {
            return [
                [0, 0, 0],
                [6, 6, 6],
                [0, 6, 0],
            ];
        } else if (type === "Z") {
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0],
            ];
        }
    }

    drawNext = () => {
        this.nextContext.fillStyle = "#000";
        this.nextContext.fillRect(0, 0, this.next.width, this.next.height);
        this.drawMatrix(this.nextArena, {x: 0, y: 0}, this.nextContext);
        this.drawMatrix(this.player.next, {x: 1, y: 1}, this.nextContext);
    }

    draw = () => {
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawMatrix(this.arena, {x: 0, y: 0}, this.context);
        this.drawMatrix(this.player.matrix, this.player.pos, this.context);
    }

    drawMatrix = (mat: Matrix, offset: any, cont: any) => {
        mat.forEach((row: number[], y: number) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    cont.fillStyle = this.colors[value];
                    cont.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    arenaSweep = () => {
        let rowCount = 1;
        outer: for (let y = this.arena.length - 1; y > 0; y--) {
            for (let x = 0; x < this.arena[y].length; x++) {
                if (this.arena[y][x] === 0) {
                    continue outer;
                }
            }
            const row = this.arena.splice(y, 1)[0].fill(0);
            this.arena.unshift(row);
            y++;

            this.player.score += rowCount * 100;
            rowCount *= 2;
            let scoreStr = this.player.score.toString();
            if (scoreStr.length > 3) {
                let num = Number(scoreStr.slice(0, scoreStr.length - 3));
                this.player.level = num + 1;
                this.player.dropInterval = 1000 - num * 50;
                this.player.DROP_SLOW = 1000 - num * 50;
            }
        }
    }

    collide = (arena : Matrix, player: Player) => {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; y++) {
            for (let x = 0; x < m[y].length; x++) {
                if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    clearPlayer = () => {
        this.player.dropInterval = 1000;
        this.player.DROP_SLOW = 1000;
        this.player.score = 0;
        this.player.level = 1;
        this.arena.forEach((row: number[]) => row.fill(0));
    }

    playerReset = () => {
        const pieces = "IJLOSTZ";
        if (this.player.next === null) {
            this.player.matrix = this.createPiece(pieces[(pieces.length * Math.random()) | 0]);
            this.player.next = this.createPiece(pieces[(pieces.length * Math.random()) | 0]);
        } else {
            this.player.matrix = this.player.next;
            this.player.next = this.createPiece(pieces[(pieces.length * Math.random()) | 0]);
        }
        this.drawNext();
        this.player.pos.y = 0;
        this.player.pos.x = ((this.arena[0].length / 2) | 0) - ((this.player.matrix[0].length / 2) | 0);
        if (this.collide(this.arena, this.player)) {
            this.pause = true;
            this.gameOver = false;
            this.showModal();
        }
    }

    merge = () => {
        this.player.matrix.forEach((row: number[], y: number) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.arena[y + this.player.pos.y][x + this.player.pos.x] = value;
                }
            });
        });
    }

    keyListener = (e: any) => {
        console.log(e);
        if (e.type === "keydown") {
            if (e.keyCode === 37) {
                this.playerMove(-1);
            } else if (e.keyCode === 39) {
                this.playerMove(1);
            } else if (e.keyCode === 81) {
                this.playerRotate(-1);
            } else if (e.keyCode === 87 || e.keyCode === 38) {
                this.playerRotate(1);
            } else if (e.keyCode === 27) {
                if(this.pause){
                    this.pause = false
                    this.update()
                }else{
                    this.pause = true;
                }
            }
        }

        if (e.keyCode === 40) {
            if (e.type === "keydown") {
                if (this.player.dropInterval !== this.DROP_FAST) {
                    this.playerDrop();
                    this.player.dropInterval = this.DROP_FAST;
                }
            } else {
                this.player.dropInterval = this.player.DROP_SLOW;
            }
        }
    }

    playerRotate = (dir: number) => {
        const pos = this.player.pos.x;
        let offset = 1;
        this.rotate(this.player.matrix, dir);

        while (this.collide(this.arena, this.player)) {
            this.player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.player.matrix[0].length) {
                this.rotate(this.player.matrix, -dir);
                this.player.pos.x = pos;
                return;
            }
        }
    }

    playerMove = (dir: number) => {
        this.player.pos.x += dir;
        if (this.collide(this.arena, this.player)) {
            this.player.pos.x -= dir;
        }
    }

    rotate = (matrix: Matrix, dir: number) => {
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < y; x++) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        if (dir > 0) {
            matrix.forEach((row: any) => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    playerDrop = () => {
        this.player.pos.y++;
        if (this.collide(this.arena, this.player)) {
            this.player.pos.y--;
            this.merge();
            this.playerReset();
            this.arenaSweep();
        }
        this.dropCounter = 0;
    }

    update = (time = 0) => {
        if (!this.pause) {
            const deltaTime = time - this.lastTime;
            this.lastTime = time;
            this.dropCounter += deltaTime;
            if (this.dropCounter > this.player.dropInterval) {
                this.playerDrop();
            }
            this.draw();
            requestAnimationFrame(this.update);
        } else {
            this.draw();
        }
    }

    newGame = () => {
        this.gameOver = false;
        this.hideModal();
        this.clearPlayer();
        this.pause = false;
        this.playerReset();
        this.update();
        this.isGameStarted = true;
    }

}

export default new Tetris();