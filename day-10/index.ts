const { readFile, pipe } = require('../utils');

const input = readFile('input.txt').split('\n');
const mat = input.map((x) => x.split(''));

type Coord = [number, number];

const SymbolsMap: Record<string, string> = {
    L: '╰',
    J: '╯',
    F: '╭',
    7: '╮',
    '.': '.',
    '-': '─',
    '|': '|'
};

const pipes = {
    ['|']: ['north', 'south'],
    ['-']: ['west', 'east'],
    ['L']: ['north', 'east'],
    ['J']: ['north', 'west'],
    ['7']: ['south', 'west'],
    ['F']: ['south', 'east']
};

const pipeRules = [
    {
        '|': ([n, s, _, __]) =>
            pipes[n]?.includes('south') && pipes[s]?.includes('north')
    },
    {
        '-': ([_, __, w, e]) =>
            pipes[e]?.includes('west') && pipes[w]?.includes('east')
    },
    {
        L: ([n, _, __, e]) =>
            pipes[n]?.includes('south') && pipes[e]?.includes('west')
    },
    {
        J: ([n, _, w, __]) =>
            pipes[n]?.includes('south') && pipes[w]?.includes('east')
    },
    {
        7: ([n, s, w, e]) =>
            pipes[s]?.includes('north') && pipes[w]?.includes('east')
    },
    {
        F: ([n, s, w, e]) =>
            pipes[s]?.includes('north') && pipes[e]?.includes('west')
    }
];

class Util {
    static findStartingPosition(): Coord {
        for (let i = 0; i < mat.length; i++) {
            for (let j = 0; j < mat[i].length; j++) {
                if (mat[i][j] === 'S') {
                    return [i, j];
                }
            }
        }
    }
    static adjacentCoords([x, y]: Coord): Coord[] {
        return [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1]
        ].map(([dr, dc]) => {
            return [x + dr, y + dc];
        });
    }
    static determingStartPipeType(coords: Coord) {
        const adjacents = this.adjacentCoords(coords);
        const pipes: any = adjacents.map((a) => this.getPipeByCoord(a));

        for (const rule of pipeRules) {
            const [key, ruleApplies] = Object.entries(rule)[0];

            if (ruleApplies(pipes)) return key;
        }
    }
    static getPipeByCoord([x, y]: Coord) {
        return mat?.[x]?.[y];
    }
}

function startCoords() {
    const [sx, sy] = Util.findStartingPosition();
    const pipeType = Util.determingStartPipeType([sx, sy]);
    mat[sx][sy] = pipeType;

    return [sx, sy];
}

const canGoNorth = (x) => ['|', 'L', 'J'].includes(x);
const canGoSouth = (x) => ['|', '7', 'F'].includes(x);
const canGoEast = (x) => ['-', 'L', 'F'].includes(x);
const canGoWest = (x) => ['-', '7', 'J'].includes(x);

let sum = 0;

const canGo = (char, dir) => {
    switch (dir) {
        case 'north':
            return canGoNorth(char);
        case 'south':
            return canGoSouth(char);
        case 'west':
            return canGoWest(char);
        case 'east':
            return canGoEast(char);
    }
};

function findNextMove(x, y, visited) {
    const char = mat[x][y];
    const valid = [
        [-1, 0, 'north', 'south'],
        [1, 0, 'south', 'north'],
        [0, -1, 'west', 'east'],
        [0, 1, 'east', 'west']
    ].find(([dx, dy, dir, from]) => {
        const des = mat?.[x + dx]?.[y + dy];
        const desEntBelongs = pipes[des]?.includes(from);
        const wasVisited = visited.find(
            ([cx, cy]) => cx === x + dx && cy === y + dy
        );

        return canGo(char, dir) && desEntBelongs && !wasVisited;
    });

    if (!valid) return null;
    return [valid[0] + x, valid[1] + y];
}

const traversed = [];

const rows = {};

function traverse(x, y, visited) {
    let nextMove;
    let sum = 0;

    while (nextMove !== null) {
        traversed.push(`${x},${y}`);
        if (rows[x]) {
            rows[x].push(y);
        } else {
            rows[x] = [y];
        }
        nextMove = findNextMove(x, y, visited);
        mat[x][y] = SymbolsMap[mat[x][y]];
        visited.push([x, y]);
        x = nextMove?.[0];
        y = nextMove?.[1];
        sum++;
    }
}

const [sx, sy] = startCoords();

traverse(sx, sy, []);

wipeMatrix();

function wipeMatrix() {
    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[i].length; j++) {
            if (!isInPipeBoundary(i, j) && mat[i][j] !== ' ') {
                mat[i][j] = '.';
            }
        }
    }
}

function isInPipeBoundary(i, j) {
    return traversed.includes(`${i},${j}`);
}

for (const [k, v] of Object.entries(rows)) {
    rows[k] = (v as []).sort((a, b) => a - b);
}

function countTheInsides(ranges: { ins: boolean; range: [number, number] }[]) {
    let sum = 0;

    for (let i = 0; i < ranges.length - 1; i++) {
        const { ins, range } = ranges[i];
        const [st, end] = range;

        const { range: nextRange } = ranges[i + 1];
        const [nextSt] = nextRange;

        if (ins) {
            sum += nextSt - end - 1;
        }
    }

    return sum;
}

function determinePipeRanges(indexes) {
    let inside = false;
    const mapWithDirs = [];

    for (let i = 0; i < indexes.length; i++) {
        const obj = indexes[i];

        if (obj.type === 'wall') {
            if (inside) {
                inside = false;
            } else if (!inside) {
                inside = true;
            }

            mapWithDirs.push({
                ins: inside,
                range: [obj.start, obj.start]
            });
        }

        if (obj.type === 'pipe') {
            const relativeDir = determineWherePipeEnds(
                obj.startSign,
                obj.endSign
            );

            if (!inside && relativeDir === 'inside') {
                inside = true;
            } else if (!inside && relativeDir === 'outside') {
                inside = false;
            } else if (inside && relativeDir === 'outside') {
                inside = true;
            } else if (inside && relativeDir === 'inside') {
                inside = false;
            }

            mapWithDirs.push({
                ins: inside,
                range: [obj.start, obj.end]
            });
        }
    }

    return mapWithDirs;
}

// assumes its first pipe
function determineWherePipeEnds(st, end) {
    if (st === '╭' && end === '╮') return 'outside';
    if (st === '╭' && end === '╯') return 'inside';
    if (st === '╰' && end === '╮') return 'inside';
    if (st === '╰' && end === '╯') return 'outside';
    if (st === '|') return 'inside';
}

function findPipesIndexes(line: string[]) {
    const indexes = [];

    for (let i = 0; i < line.length; i++) {
        if (line[i] === '|') {
            // wall is just one index. we will determine direction. edge case.
            indexes.push({
                start: i,
                sign: line[i],
                type: 'wall'
            });
        } else if (['╭', '╰'].includes(line[i])) {
            // we found starting node.
            let j = i;
            // we are looking for the end
            while (!['╯', '╮'].includes(line[j])) {
                j++;
            }
            // now that we found ending index we can save it
            // we can determine the direction later in another function
            indexes.push({
                start: i,
                end: j,
                startSign: line[i],
                endSign: line[j],
                type: 'pipe'
            });

            // jump to the outer
            i = j;
        }
    }

    return indexes;
}

console.log({
    part2: mat.reduce(
        (acc, value) =>
            acc +
            pipe(findPipesIndexes, determinePipeRanges, countTheInsides)(value),
        0
    )
});
