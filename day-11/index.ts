const { readFile, findAllIndexes, rotateMatrix } = require('../utils');

const galaxy = readFile('input.txt')
    .split('\n')
    .filter((x) => x)
    .map((x) => x.split(''));

const expandedGalaxy = expandGalaxy(galaxy);

const distances = findShortestDistancesBetweenGalaxies(expandedGalaxy);

function findShortestDistancesBetweenGalaxies(galaxy) {
    const galaxyPositions = galaxy.reduce((a, space, i) => {
        const galaxiesIndex = findAllIndexes(space, (space) => space === '#');
        const newPositions = galaxiesIndex.map((gi) => [i, gi]);
        return newPositions.length > 0 ? a.concat(newPositions) : a;
    }, []);
    return galaxyPositions.reduce(
        (a1, [gx, gy], i) =>
            a1 +
            galaxyPositions
                .slice(0, i + 1)
                .reduce((a2, [cx, cy]) => a2 + cdist(gx, cx, gy, cy), 0),
        0
    );
}

function cdist(x1, x2, y1, y2) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function expandGalaxy(galaxy) {
    const rowIndexes = findAllIndexes(galaxy, checkSpaceForGalaxy);
    const colIndexes = findAllIndexes(
        rotateMatrix(galaxy),
        checkSpaceForGalaxy
    );
    const galaxyForExp = [...galaxy];
    expandGalaxyRows(galaxyForExp, rowIndexes);
    const rotatedGalaxy = rotateMatrix(galaxyForExp);
    expandGalaxyRows(rotatedGalaxy, colIndexes);
    return rotateMatrix(rotatedGalaxy);
}

function expandGalaxyRows(galaxy, indexes) {
    return indexes.forEach((ri, i) => {
        galaxy.splice(ri + i, 0, galaxy[ri + i]);
    });
}

function checkSpaceForGalaxy(row: string[], i = 0) {
    if (row[i] === '#') return false;
    if (i === row.length) return i;
    return checkSpaceForGalaxy(row, i + 1);
}

console.log({ part1Answer: distances });
