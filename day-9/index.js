const { readFile, mapToNumArray } = require('../utils');
const sequences = readFile('input.txt').split('\n').map(mapToNumArray);

const calcDiffs = (seq) => seq.slice(0, -1).reduce((acc, value, i) => [...acc, seq[i + 1] - value], []);
const nextSeq = (diffs) => (diffs.some((diff) => diff !== 0) ? nextSeq(calcDiffs(diffs)) + diffs.at(-1) : 0);
const prevSeq = (seq, diffs) => (diffs.some((diff) => diff !== 0) ? -1 * (prevSeq(diffs, calcDiffs(diffs)) - seq[0]) : -1 * -seq[0]);

console.log(
    sequences.reduce((a, ss) => a + ss.at(-1) + nextSeq(calcDiffs(ss)), 0),
    sequences.reduce((a, ss) => a + prevSeq(ss, calcDiffs(ss)), 0)
);
