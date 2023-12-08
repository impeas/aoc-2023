const fs = require('fs');

const file = fs.readFileSync('input.txt', 'utf-8').split('\n');
const dirs = file[0].split('');
const END_NODE = 'ZZZ';
const nodes = {};
file.slice(2).forEach((node) => {
    const nodeRegex = /(?<name>\S+)\s+=\s+\((?<L>[^,]+),\s+(?<R>[^)]+)/;
    const { name, L, R } = nodeRegex.exec(node)?.groups || {};
    nodes[name] = {
        L,
        R
    };
});

// part 1
let path;
let currentNode = nodes['AAA'];
let i = 0;

while (path !== END_NODE) {
    const dir = dirs[i++ % dirs.length];
    const nextNode = nodes[currentNode[dir]];
    if (currentNode[dir] === END_NODE) break;
    currentNode = nextNode;
}

// part 2

const startNodes = Object.entries(nodes).filter(([k, v]) => k.match(/..A/));
const dividers = [];

let j = 0;
for (let node of startNodes) {
    while (true) {
        node = move(node, dirs[j % dirs.length]);
        j++;
        if (node[0].match(/..Z/)) {
            dividers.push(j);
            break;
        }
    }
    j = 0;
}

const gcd = (a, b) => (b == 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const lcmAll = (ns) => ns.reduce(lcm, 1);

function move(node, dir) {
    return [node[1][dir], nodes[node[1][dir]]];
}

console.log({ part1Answer: i, part2Answer: lcmAll(dividers) });
