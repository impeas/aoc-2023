const { readFile, mapToNumArray } = require('../utils');
const sequences = readFile('input.txt').split('\n').map(mapToNumArray);

function nextSeq(seq) {
    const diffs = seq.slice(0, -1).reduce((acc, value, i) => [...acc, seq[i + 1] - value], []);
    return diffs.some((diff) => diff !== 0) ? nextSeq(diffs) + diffs.at(-1) : 0;
}

function prevSeq(seq) {
    const diffs = seq.slice(0, -1).reduce((acc, value, i) => [...acc, seq[i + 1] - value], []);
    return diffs.some((diff) => diff !== 0) ? -1 * (prevSeq(diffs) - seq[0]) : -1 * -seq[0];
}

console.log(
    sequences.reduce((a, ss) => a + ss.at(-1) + nextSeq(ss), 0),
    sequences.reduce((a, ss) => a + prevSeq(ss), 0)
);
