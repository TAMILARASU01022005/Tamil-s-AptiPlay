export type EntityType = 'ball' | 'block' | 'obstacle';

export interface Entity {
    id: string;
    type: EntityType;
    color?: string; // Tailwind bg color class
    w: number;
    h: number;
    x: number;
    y: number;
}

export interface LevelDef {
    id: number;
    cols: number;
    rows: number;
    hole: { x: number; y: number };
    entities: Entity[];
}

export type Move = { dx: number; dy: number };

export const DIRECTIONS: Record<string, Move> = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
};

// Return a 2D array indicating which entity ID occupies each cell, or empty string.
export function getGridCache(level: LevelDef, entities: Entity[]): string[][] {
    const grid = Array.from({ length: level.rows }, () =>
        Array(level.cols).fill('')
    );

    for (const ent of entities) {
        for (let r = ent.y; r < ent.y + ent.h; r++) {
            for (let c = ent.x; c < ent.x + ent.w; c++) {
                if (r >= 0 && r < level.rows && c >= 0 && c < level.cols) {
                    grid[r][c] = ent.id;
                }
            }
        }
    }
    return grid;
}

export function isValidMove(
    level: LevelDef,
    entities: Entity[],
    entityId: string,
    targetX: number,
    targetY: number
): boolean {
    const entity = entities.find((e) => e.id === entityId);
    if (!entity) return false;
    if (entity.type === 'obstacle') return false;

    // Must move in a straight line (horizontal or vertical)
    const isHorizontal = entity.y === targetY;
    const isVertical = entity.x === targetX;

    if (!isHorizontal && !isVertical) return false;
    if (entity.x === targetX && entity.y === targetY) return false;

    // Boundary check
    if (
        targetX < 0 ||
        targetY < 0 ||
        targetX + entity.w > level.cols ||
        targetY + entity.h > level.rows
    ) {
        return false;
    }

    const grid = getGridCache(level, entities);

    // Path check: Check every cell between current and target
    const startX = Math.min(entity.x, targetX);
    const endX = Math.max(entity.x, targetX);
    const startY = Math.min(entity.y, targetY);
    const endY = Math.max(entity.y, targetY);

    for (let r = startY; r < endY + entity.h; r++) {
        for (let c = startX; c < endX + entity.w; c++) {
            const cellId = grid[r][c];
            // Cell must be either empty or occupied by THE SAME entity
            if (cellId !== '' && cellId !== entity.id) {
                return false;
            }
        }
    }

    return true;
}


export function checkWinPattern(level: LevelDef, entities: Entity[]): boolean {
    const ball = entities.find((e) => e.type === 'ball');
    if (!ball) return false;

    // Win if ball completely spans the hole (usually both are 1x1)
    for (let r = ball.y; r < ball.y + ball.h; r++) {
        for (let c = ball.x; c < ball.x + ball.w; c++) {
            if (r === level.hole.y && c === level.hole.x) {
                return true;
            }
        }
    }
    return false;
}

// Predefined levels
export const motionLevels: LevelDef[] = [
    {
        id: 1,
        cols: 4,
        rows: 6,
        hole: { x: 3, y: 1 },
        entities: [
            { id: 'ball', type: 'ball', color: 'bg-red-500', w: 1, h: 1, x: 0, y: 1 },
            { id: 'obs1', type: 'obstacle', w: 1, h: 1, x: 1, y: 0 },
            { id: 'obs2', type: 'obstacle', w: 1, h: 1, x: 2, y: 0 },
            { id: 'obs3', type: 'obstacle', w: 1, h: 1, x: 3, y: 0 },
            { id: 'obs4', type: 'obstacle', w: 1, h: 1, x: 0, y: 2 },
            { id: 'obs5', type: 'obstacle', w: 1, h: 1, x: 2, y: 2 },
            { id: 'b1', type: 'block', color: 'bg-purple-600', w: 1, h: 2, x: 1, y: 1 },
            { id: 'b2', type: 'block', color: 'bg-blue-500', w: 2, h: 1, x: 0, y: 4 },
            { id: 'b3', type: 'block', color: 'bg-amber-500', w: 1, h: 1, x: 3, y: 4 },
            { id: 'b4', type: 'block', color: 'bg-blue-800', w: 1, h: 1, x: 1, y: 5 },
        ],
    },
    {
        id: 2,
        cols: 4,
        rows: 6,
        hole: { x: 3, y: 0 },
        entities: [
            { id: 'ball', type: 'ball', color: 'bg-red-500', w: 1, h: 1, x: 0, y: 5 },
            { id: 'obs1', type: 'obstacle', w: 1, h: 1, x: 1, y: 1 },
            { id: 'obs2', type: 'obstacle', w: 1, h: 1, x: 3, y: 2 },
            { id: 'b1', type: 'block', color: 'bg-indigo-500', w: 2, h: 1, x: 0, y: 2 },
            { id: 'b2', type: 'block', color: 'bg-emerald-500', w: 1, h: 2, x: 2, y: 3 },
            { id: 'b3', type: 'block', color: 'bg-rose-500', w: 1, h: 1, x: 1, y: 4 },
        ],
    },
    {
        id: 3,
        cols: 5,
        rows: 6,
        hole: { x: 4, y: 2 },
        entities: [
            { id: 'ball', type: 'ball', color: 'bg-red-500', w: 1, h: 1, x: 0, y: 2 },
            { id: 'obs1', type: 'obstacle', w: 1, h: 1, x: 2, y: 1 },
            { id: 'obs2', type: 'obstacle', w: 1, h: 1, x: 2, y: 3 },
            { id: 'obs3', type: 'obstacle', w: 1, h: 1, x: 4, y: 0 },
            { id: 'b1', type: 'block', color: 'bg-sky-500', w: 1, h: 3, x: 1, y: 1 },
            { id: 'b2', type: 'block', color: 'bg-orange-500', w: 2, h: 1, x: 2, y: 4 },
            { id: 'b3', type: 'block', color: 'bg-fuchsia-500', w: 1, h: 2, x: 3, y: 1 },
            { id: 'b4', type: 'block', color: 'bg-teal-500', w: 1, h: 1, x: 0, y: 4 },
        ],
    }
];
