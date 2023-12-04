const fs = require('fs');

const file = fs.readFileSync('input.txt', 'utf8').split('\n');

function mapToNumArray(arr) {
    return arr.split(' ').reduce((acc, val) => {
        const num = parseInt(val);
        if (!isNaN(num)) acc.push(num);
        return acc;
    }, []);
}

function parseGame(string) {
    const { gameId, left, right } =
        /Card\s+(?<gameId>\d+):\s+(?<left>[^|]+)\|\s*(?<right>.+)/.exec(string)
            ?.groups || {};

    return {
        gameId,
        left: mapToNumArray(left),
        right: mapToNumArray(right)
    };
}

function getTotalPoints() {
    return file.reduce((acc, value) => {
        const { left, right } = parseGame(value);
        const points = left.filter((g) => right.includes(g)).length;
        return points > 0 ? acc + Math.pow(2, points - 1) : acc;
    }, 0);
}

const points = getTotalPoints();

console.log({
    part1Answer: points
});
// 55866, 78613, 2120, 2054
