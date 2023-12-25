const { readFile } = require('../utils');
const bxs = Array.from({ length: 256 }, () => []);
const input = readFile('input.txt').split(',');

const hash = (s) => s.split('').reduce((a, ch) => ((ch.charCodeAt(0) + a) * 17) % 256, 0);

const lnData = (lens) =>
    [lens.replace('-', '=').split('=')[0]].map((label) => ({ label, hash: hash(label) }))[0];

const solveLn = (ln) => {
    const { label, hash } = lnData(ln);
    if (ln.includes('-')) {
        bxs[hash] = bxs[hash].filter((ln) => lnData(ln).label !== label);
    }
    if (ln.includes('=')) {
        const i = bxs[hash].findIndex((ln) => lnData(ln).label === label);
        if (i !== -1) bxs[hash][i] = i !== -1 ? ln : bxs[hash[i]];
        else bxs[hash].push(ln);
    }
};

const power = (lns) => {
    lns.forEach(solveLn);
    return bxs.reduce(
        (a, ln, bi) => a + ln.reduce((a, ln, li) => (bi + 1) * (li + 1) * ln.split('=')[1] + a, 0),
        0
    );
};

console.log({
    part1: input.reduce((acc, value) => hash(value) + acc, 0),
    part2: power(input)
});
