
export type Player = {
    pos: { x: number, y: number },
    matrix: any | null,
    score: number,
    level: number,
    dropInterval: number,
    DROP_SLOW: number,
    next: any | null,
};