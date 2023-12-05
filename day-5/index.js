const fs = require('fs');
const { mapToNumArray } = require('../utils');

const file = fs.readFileSync('input.txt', 'utf8').split('\n\n');
const maps = file.slice(1);
const parsedMaps = maps.map((map) => parseMap(map));

const parseSeeds = (seedString) => {
    const { content } = /seeds: (?<content>.*)/.exec(seedString)?.groups || {};
    return mapToNumArray(content);
};

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
        if (seed >= start && seed <= start + length - 1) {
            const index = dest - start;
            return seed + index;
        }
    }
    return seed;
};

const seeds = parseSeeds(file[0]);

const getLocationsForSeeds = () =>
    seeds.map((seed) =>
        parsedMaps.reduce((acc, map) => findSeed(map, acc), seed)
    );

console.log({
    part1Answer: Math.min(...getLocationsForSeeds())
});
