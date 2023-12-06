const fs = require('fs');
const { mapToNumArray } = require('../utils');

const input = fs.readFileSync('input.txt', 'utf8').split('\n');
const races = parseRaces(input);

function parseRaces(input) {
    const times = mapToNumArray(input[0]);
    const distances = mapToNumArray(input[1]);
    return Array.from({ length: times.length }).map((_, i) => {
        return {
            time: times[i],
            distance: distances[i]
        };
    });
}

function findQuadraticCoefficients(y1, y2) {
    const a = (2 * y1 - 1 * y2) / -2;
    const b = (1 ** 2 * y2 - 2 ** 2 * y1) / -2;
    return { a, b };
}

function findQuadraticRoots(a, b, c) {
    const r1 = (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
    const r2 = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
    return { r1, r2 };
}

function getCombinationsForRace(race) {
    const y1 = race.time - 1;
    const y2 = (race.time - 2) * 2;
    const { a, b } = findQuadraticCoefficients(y1, y2);
    const { r1, r2 } = findQuadraticRoots(a, b, -race.distance);
    return Math.ceil(r2) - Math.ceil(r1);
}

const bigRace = races.reverse().reduce(
    (acc, race) => {
        const distance = race.distance + acc.distance;
        const time = race.time + acc.time;
        return { time, distance };
    },
    { time: '', distance: '' }
);

const part1 = races.reduce(
    (acc, race) => getCombinationsForRace(race) * acc,
    1
);

const part2 = getCombinationsForRace(bigRace);

console.log({ part1, part2 });
