const fs = require('fs');
const { mapToNumArray, chunkArray } = require('../utils');

const input = fs.readFileSync('input.txt', 'utf8').split('\n\n');
const stringMaps = input.slice(1);
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

const seeds = parseSeeds(input[0]);

function parseMap(mapString) {
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

function bruteForceSmallestLocation(rangeSeeds) {
    for (let i = 0; i < 1_000_000_000; i++) {
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

console.log({
    part1Answer: Math.min(...getLocationsForSeeds())
    // part2Answer: bruteForceSmallestLocation(chunkArray(seeds, 2))
});
