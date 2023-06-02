import tetris from "../../../store/tetris";
import {Player} from "../../../models/Player";


export function useTetris() {
    tetris.nextArena = createMatrix(6, 6);

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

    function drawNext() {
        tetris.nextContext.fillStyle = "#000";
        tetris.nextContext.fillRect(0, 0, tetris.next.width, tetris.next.height);
        drawMatrix(tetris.nextArena, {x: 0, y: 0}, tetris.nextContext);
        drawMatrix(tetris.player.next, {x: 1, y: 1}, tetris.nextContext);

    }

    function draw() {
        tetris.context.fillStyle = "#000";
        tetris.context.fillRect(0, 0, tetris.canvas.width, tetris.canvas.height);
        drawMatrix(tetris.arena, {x: 0, y: 0}, tetris.context);
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

    function arenaSweep() {
        let rowCount = 1;
        outer: for (let y = tetris.arena.length - 1; y > 0; y--) {
            for (let x = 0; x < tetris.arena[y].length; x++) {
                if (tetris.arena[y][x] === 0) {
                    continue outer;
                }
            }
            const row = tetris.arena.splice(y, 1)[0].fill(0);
            tetris.arena.unshift(row);
            y++;

            tetris.player.score += rowCount * 100;
            rowCount *= 2;
            let scoreStr = tetris.player.score.toString();
            if (scoreStr.length > 3) {
                let num = Number(scoreStr.slice(0, scoreStr.length - 3));
                tetris.player.level = num + 1;
                tetris.player.dropInterval = 1000 - num * 50;
                tetris.player.DROP_SLOW = 1000 - num * 50;
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
        drawNext();
        tetris.player.pos.y = 0;
        tetris.player.pos.x = ((tetris.arena[0].length / 2) | 0) - ((tetris.player.matrix[0].length / 2) | 0);
        if (collide(tetris.arena, tetris.player)) {
            // pauseGame();
            // document.removeEventListener("keydown", keyListener);
            // document.removeEventListener("keyup", keyListener);
            clearPlayer();
        }
    }

    function merge() {
        tetris.player.matrix.forEach((row: number[], y: number) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    tetris.arena[y + tetris.player.pos.y][x + tetris.player.pos.x] = value;
                }
            });
        });
    }

    function keyListener(e: any) {
        if (e.type === "keydown") {
            if (e.keyCode === 37) {
                playerMove(-1);
            } else if (e.keyCode === 39) {
                playerMove(1);
            } else if (e.keyCode === 81) {
                playerRotate(-1);
            } else if (e.keyCode === 87 || e.keyCode === 38) {
                playerRotate(1);
            } else if (e.keyCode === 27) {
                // pauseGame();
            }
        }

        if (e.keyCode === 40) {
            if (e.type === "keydown") {
                if (tetris.player.dropInterval !== tetris.DROP_FAST) {
                    playerDrop();
                    tetris.player.dropInterval = tetris.DROP_FAST;
                }
            } else {
                tetris.player.dropInterval = tetris.player.DROP_SLOW;
            }
        }
    }

    function pauseGame() {

    }

    function playerRotate(dir: any) {
        const pos = tetris.player.pos.x;
        let offset = 1;
        rotate(tetris.player.matrix, dir);

        while (collide(tetris.arena, tetris.player)) {
            tetris.player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > tetris.player.matrix[0].length) {
                rotate(tetris.player.matrix, -dir);
                tetris.player.pos.x = pos;
                return;
            }
        }
    }

    function playerMove(dir:any) {
        tetris.player.pos.x += dir;
        if (collide(tetris.arena, tetris.player)) {
            tetris.player.pos.x -= dir;
        }
    }

    function rotate(matrix: any, dir: any) {
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

    function playerDrop() {
        tetris.player.pos.y++;
        if (collide(tetris.arena, tetris.player)) {
            tetris.player.pos.y--;
            merge();
            playerReset();
            arenaSweep();
            // updateScore();
        }
        tetris.dropCounter = 0;
    }





    function update(time = 0) {
        if (!tetris.pause) {
            const deltaTime = time - tetris.lastTime;
            tetris.lastTime = time;
            tetris.dropCounter += deltaTime;
            if (tetris.dropCounter > tetris.player.dropInterval) {
                playerDrop();
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
        tetris.isGameStarted = true;
    }


    return {
        createMatrix,
        update,
        newGame,
        keyListener


    }
}