const { readFile, mapToNumArray } = require('../utils');

const sequences = readFile('input.txt').split('\n').map(mapToNumArray);

function nextSeqValue(seq) {
    const diffs = seq.slice(0, -1).reduce((acc, value, i) => [...acc, seq[i + 1] - value], []);
    return diffs.some((diff) => diff !== 0) ? nextSeqValue(diffs) + diffs.at(-1) : 0;
}

function prevSeqValue(seq) {
    const diffs = seq.slice(0, -1).reduce((acc, value, i) => [...acc, seq[i + 1] - value], []);
    return diffs.some((diff) => diff !== 0) ? -1 * (prevSeqValue(diffs) - seq[0]) : -1 * -seq[0];
}

const summedPrevSequences = sequences.reduce((acc, value) => acc + prevSeqValue(value), 0);

const summedNextSequences = sequences.reduce((acc, seq) => acc + seq.at(-1) + nextSeqValue(seq), 0);

console.log({
    part1Answer: summedNextSequences,
    part2Answer: summedPrevSequences
});
