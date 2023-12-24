const fs = require('fs');

const { rotate } = require('../utils');

const input = fs
    .readFileSync('input.txt', 'utf-8')
    .split('\n')
    .filter((x) => x)
    .map((x) => x.split(''));

const find_o_index = (line: string[]) => {
    let i = 0;
    do {
        if (line[i] === '#') return -1;
        if (line[i] === 'O') return i;
        i++;
    } while (i < line.length);
    return -1;
};

const solve = (line: string[]) => {
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '.') {
            const next_o_index = find_o_index(line.slice(i));
            if (next_o_index !== -1) {
                const temp = line[i];
                line[i] = line[i + next_o_index];
                line[i + next_o_index] = temp;
            }
        }
    }
};

const find_load = (rows: string[][]) =>
    rotate(rows, { clockwise: false }).reduce((a, r) => {
        solve(r);
        return a + r.reduce((a, v, i) => (v === 'O' ? r.length - i + a : a), 0);
    }, 0);

const load = find_load(input);

console.log({ load });

/* for part 2 rotate the patterns accordingly 
* north/west/east/south (perform cycles)
* and look for patterns in the output. 
*
  The solution is 
  x = (1_000_000_000 - n) % pattern_len
*
* where n equals the distance from output start
* to where the pattern starts. */
