const { readFile, findAllIndexes, rotateMatrix } = require('../utils');

const galaxy = readFile('input.txt')
    .split('\n')
    .filter((x) => x)
    .map((x) => x.split(''));

const npos = getCalibratedPositions(galaxy, 1);

const shortest = findShortestDistancesBetweenGalaxies(npos);

console.log({ shortest });

function findShortestDistancesBetweenGalaxies(pos) {
    return pos.reduce(
        (a1, [gx, gy], i) =>
            a1 +
            pos
                .slice(0, i + 1)
                .reduce((a2, [cx, cy]) => a2 + cdist(gx, cx, gy, cy), 0),
        0
    );
}

function getCalibratedPositions(galaxy) {
    const galaxyPositions = galaxy.reduce((a, space, i) => {
        const galaxiesIndex = findAllIndexes(space, (space) => space === '#');
        const newPositions = galaxiesIndex.map((gi) => [i, gi]);
        return newPositions.length > 0 ? a.concat(newPositions) : a;
    }, []);

    const { rowIndexes, colIndexes } = findRowColIndexes(galaxy);
    const npos = [];

    for (let i = 0; i < galaxyPositions.length; i++) {
        const [gi, gj] = galaxyPositions[i];

        const l_cols = colIndexes.filter((col) => col < gj).length * 999999;
        const t_rows = rowIndexes.filter((row) => row < gi).length * 999999;
        const new_j = gj + l_cols;
        const new_i = gi + t_rows;

        npos.push([new_i, new_j]);
    }

    return npos;
}

function cdist(x1, x2, y1, y2) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function findRowColIndexes(galaxy) {
    const rowIndexes = findAllIndexes(galaxy, checkSpaceForGalaxy);
    const colIndexes = findAllIndexes(
        rotateMatrix(galaxy),
        checkSpaceForGalaxy
    );
    return { rowIndexes, colIndexes };
}

function checkSpaceForGalaxy(row: string[], i = 0) {
    if (row[i] === '#') return false;
    if (i === row.length) return i;
    return checkSpaceForGalaxy(row, i + 1);
}
