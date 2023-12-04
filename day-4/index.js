const fs = require('fs');
const { mapToNumArray } = require('../utils');

const file = fs.readFileSync('input_1.txt', 'utf8').split('\n');
const games = file.map((line) => parseGame(line));

function getTotalPoints() {
    return file.reduce((acc, value) => {
        const { points } = parseGame(value);
        return points > 0 ? acc + Math.pow(2, points - 1) : acc;
    }, 0);
}

function getTotalScratchcards() {
    return games.reduce((acc, game) => acc + sumGame(game) + 1, 0);
}

function sumGame(game) {
    return game.refs.reduce((acc, ref) => acc + sumGame(games[ref]) + 1, 0);
}

function parseGame(string) {
    const { gameId, left, right } =
        /Card\s+(?<gameId>\d+):\s+(?<left>[^|]+)\|\s*(?<right>.+)/.exec(string)
            ?.groups || {};

    const points = mapToNumArray(left).filter((g) =>
        mapToNumArray(right).includes(g)
    ).length;

    const id = parseInt(gameId) - 1;

    return {
        id,
        points,
        refs: Array.from({ length: points }).map((_, i) => id + i + 1)
    };
}

console.log({
    part1Answer: getTotalPoints(),
    part2Answer: getTotalScratchcards()
});
