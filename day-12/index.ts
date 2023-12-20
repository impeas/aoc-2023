const { readFile } = require('../utils');

const cache = {};

const springs = readFile('input.txt')
    .split('\n')
    .filter((x) => x)
    .map((line) => {
        const splitted = line.split(' ');
        return {
            str: splitted[0],
            ptn: splitted[1].split(',').map((x) => parseInt(x))
        };
    });

function replaceAt(str, index, ch) {
    return str.replace(/./g, (c, i) => (i == index ? ch : c));
}
function seqHashLength(str) {
    for (let i = 0; i < str.length; i++) {
        if ('#' !== str[i]) return i;
    }
    return str.length;
}

function countCombinations(str: string, groups: number[]) {
    const cacheKey = `${str}:${groups.toString()}`;
    const cacheValue = cache[cacheKey];
    let result = 0;

    if (typeof cacheValue === 'number') {
        return cacheValue;
    }

    if (str[0] === '.') {
        result += countCombinations(str.substring(1), groups);
    } else if (str[0] === '?') {
        result += countCombinations(replaceAt(str, 0, '.'), groups);
        result += countCombinations(replaceAt(str, 0, '#'), groups);
    } else if (str[0] === '#') {
        const seqlength = seqHashLength(str);
        if (seqlength === groups[0]) {
            if (groups.length === 1) {
                if (!str.substring(seqlength).includes('#')) {
                    return 1;
                }
            } else {
                result += countCombinations(
                    str.substring(seqlength + 1),
                    groups.slice(1)
                );
            }
        } else if (seqlength < groups[0] && str[seqlength] === '?') {
            result += countCombinations(replaceAt(str, seqlength, '#'), groups);
        }
    }
    cache[cacheKey] = result;
    return result;
}

const mod = (str, ptn, withModifier): [string, number[]] => {
    if (!withModifier) return [str, ptn];

    let conc = str;
    const nPtn = [...ptn];
    for (let i = 0; i < 4; i++) {
        conc = conc.concat('?', str);
        nPtn.push([...ptn]);
    }
    return [conc, nPtn.flat()];
};

const countModifierFlag = (withModifier) =>
    springs.reduce(
        (acc, { str, ptn }) =>
            countCombinations(...mod(str, ptn, withModifier)) + acc,
        0
    );

console.log({
    part1: countModifierFlag(false),
    part2: countModifierFlag(true)
});
