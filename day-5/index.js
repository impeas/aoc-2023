const fs = require('fs');
const { mapToNumArray } = require('../utils');

const file = fs.readFileSync('input.txt', 'utf8').split('\n\n');

const parseSeeds = (seedString) => {
    const { content } = /seeds: (?<content>.*)/.exec(seedString)?.groups || {};

    return {
        seeds: mapToNumArray(content)
    };
};

const parseMap = (mapString) => {
    const splitted = mapString.split('\n');
    const matrix = splitted.slice(1);

    const { from, to } =
        /(?<from>.*)-(.*)-(?<to>.* )/.exec(splitted[0])?.groups || {};

    return {
        from: from.trim(),
        to: to.trim(),
        matrix: matrix.map((row) => mapToNumArray(row))
    };
};

const findLowestSeed = (map, seed) => {
    for (const row of map.matrix) {
        const [dest, start, length] = row;

        if (seed >= start && seed <= start + length - 1) {
            const found = dest - start;

            console.log('Mapping found', seed, '=>', seed + found);
        } else {
        }
    }
};

const seeds = parseSeeds(file[0]);
const maps = file.slice(1);
const parsedMaps = maps.map((map) => parseMap(map));

findLowestSeed(parsedMaps[0], 99);

findLowestSeed(parsedMaps[0], 97);
