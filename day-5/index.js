const fs = require('fs');
const { mapToNumArray } = require('../utils');

const chunkArray = (arr, size) =>
    arr.length > size
        ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
        : [arr];

const file = fs.readFileSync('input.txt', 'utf8').split('\n\n');
const stringMaps = file.slice(1);
const nMaps = stringMaps.map((map) => parseMap(map));
const rMaps = stringMaps
    .map((map) => parseMap(map))
    .reverse()
    .map((map) => {
        return {
            ...map,
            matrix: map.matrix.map((row) => [row[1], row[0], row[2]])
        };
    });

const parseSeeds = (seedString) => {
    const { content } = /seeds: (?<content>.*)/.exec(seedString)?.groups || {};
    return mapToNumArray(content);
};

const seeds = parseSeeds(file[0]);

function parseMap(mapString, reversed) {
    const splitted = mapString.split('\n');
    const matrix = splitted.slice(1);
    const { from, to } =
        /(?<from>.*)-(.*)-(?<to>.* )/.exec(splitted[0])?.groups || {};
    return {
        from: from.trim(),
        to: to.trim(),
        matrix: matrix.map((row) => mapToNumArray(row))
    };
}

const findSeed = (map, seed) => {
    for (const row of map.matrix) {
        const [dest, start, length] = row;
        if (seed >= start && seed < start + length) {
            const index = dest - start;
            return seed + index;
        }
    }
    return seed;
};

function bruteForceSmallestLocation() {
    for (let i = 1_000_000_00; i < 1_000_000_000; i++) {
        const seedByLocation = rMaps.reduce(
            (acc, map) => findSeed(map, acc),
            i
        );
        for (const range of rangeSeeds) {
            const [start, length] = range;
            if (seedByLocation >= start && seedByLocation < start + length) {
                return i;
            }
        }
    }
}

const getLocationsForSeeds = () =>
    seeds.map((seed) => nMaps.reduce((acc, map) => findSeed(map, acc), seed));

const rangeSeeds = chunkArray(seeds, 2);

console.log({
    part1Answer: Math.min(...getLocationsForSeeds()),
    part2Answer: bruteForceSmallestLocation()
});
