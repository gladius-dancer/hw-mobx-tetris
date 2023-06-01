import {Player} from "../../../models/Player";
import tetris from "../../../store/tetris";


export function useTetris() {

    tetris.nextArena = createMatrix(6, 6);

    // draw();


    function createMatrix(w: number, h: number) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }

    function createPiece(type: string) {
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

    function drawNext(nextContext: any, nextCanvas: any, nextArena: any, player: Player) {
        nextContext.fillStyle = "#000";
        nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

        drawMatrix(nextArena, {x: 0, y: 0}, nextContext);
        drawMatrix(player.next, {x: 1, y: 1}, nextContext);
    }

    function draw() {

        tetris.context.fillStyle = "#000";
        tetris.context.fillRect(0, 0, tetris.canvas.width, tetris.canvas.height);

        drawMatrix(tetris.arena, {x: 0, y: 0}, tetris.context);
        // console.log(tetris.player.matrix);
        drawMatrix(tetris.player.matrix, tetris.player.pos, tetris.context);
    }

    function drawMatrix(mat: any[], offset: any, cont: any) {
        mat.forEach((row: number[], y: number) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    cont.fillStyle = tetris.colors[value];
                    cont.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    function arenaSweep(arena: any, player: Player) {
        let rowCount = 1;
        outer: for (let y = arena.length - 1; y > 0; y--) {
            for (let x = 0; x < arena[y].length; x++) {
                if (arena[y][x] === 0) {
                    continue outer;
                }
            }
            const row = arena.splice(y, 1)[0].fill(0);
            arena.unshift(row);
            y++;

            player.score += rowCount * 100;
            rowCount *= 2;
            let scoreStr = player.score.toString();
            if (scoreStr.length > 3) {
                let num = Number(scoreStr.slice(0, scoreStr.length - 3));
                player.level = num + 1;
                player.dropInterval = 1000 - num * 50;
                player.DROP_SLOW = 1000 - num * 50;
            }
        }
    }

    function collide(arena: any, player: Player) {
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

    function clearPlayer() {
        tetris.player.dropInterval = 1000;
        tetris.player.DROP_SLOW = 1000;
        tetris.player.score = 0;
        tetris.player.level = 1;
        tetris.arena.forEach((row: any) => row.fill(0));
        // updateScore();
    }

    function playerReset() {
        const pieces = "IJLOSTZ";
        if (tetris.player.next === null) {
            tetris.player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
            tetris.player.next = createPiece(pieces[(pieces.length * Math.random()) | 0]);
        } else {
            tetris.player.matrix = tetris.player.next;
            tetris.player.next = createPiece(pieces[(pieces.length * Math.random()) | 0]);
        }
        // drawNext();
        tetris.player.pos.y = 0;
        tetris.player.pos.x = ((tetris.arena[0].length / 2) | 0) - ((tetris.player.matrix[0].length / 2) | 0);
        if (collide(tetris.arena, tetris.player)) {
            // pauseGame();
            // document.removeEventListener("keydown", keyListener);
            // document.removeEventListener("keyup", keyListener);
            // clearPlayer();
        }
    }

    function merge(arena: any, player: any) {
        player.matrix.forEach((row: number[], y: number) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    function playerDrop(arena: any, player: Player,) {
        player.pos.y++;
        if (collide(arena, player)) {
            player.pos.y--;
            merge(arena, player);
            playerReset();
            arenaSweep(tetris.arena, tetris.player);
            // updateScore();
        }
        // dropCounter = 0;
    }

    let lastTime = 0;

    function update(time = 0) {
        // $("#pause").off();
        if (!tetris.pause) {
            const deltaTime = time - lastTime;
            lastTime = time;
            tetris.dropCounter += deltaTime;
            if (tetris.dropCounter > tetris.player.dropInterval) {
                playerDrop(tetris.arena, tetris.player);
            }
            draw();
            requestAnimationFrame(update);
        } else {
            draw();
        }
    }

    function newGame() {
        clearPlayer();
        tetris.pause = false;
        playerReset();
        update();
        // updateScore();
        // document.addEventListener("keydown", keyListener);
        // document.addEventListener("keyup", keyListener);
    }


    return {
        createMatrix,
        createPiece,
        draw,
        drawNext,
        drawMatrix,
        update,
        newGame


    }
}