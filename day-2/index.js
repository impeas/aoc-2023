const fs = require("fs");
const readline = require("readline");

const colors = ["red", "green", "blue"];
const colorRegex = new RegExp(colors.join("|"), "gi");

function getFewestGameMul(game) {
    return colors.reduce((acc, color) => acc * Math.max(...game[color]), 1);
}

function createGameData(string) {
    const { gameId, content } =
        /Game (?<gameId>\d+)\: (?<content>.*)/.exec(string)?.groups || {};

    const turns = content.split(";");

    const game = {
        id: parseInt(gameId),
        red: [],
        green: [],
        blue: [],
    };

    for (const turn of turns) {
        const reveals = turn.split(",");

        for (const reveal of reveals) {
            const color = reveal.match(colorRegex);
            game[color].push(reveal.match(/\d+/g)?.[0]);
        }
    }

    return game;
}

function checkPossibleGame(game) {
    for (const color of colors) {
        for (const amount of game[color]) {
            if (color === "red" && amount > 12) {
                return false;
            }

            if (color === "green" && amount > 13) {
                return false;
            }

            if (color === "blue" && amount > 14) {
                return false;
            }
        }
    }

    return true;
}

function read(filePath) {
    const readableStream = fs.createReadStream(filePath);
    const possibleGameIds = [];
    const muls = [];

    const rl = readline.createInterface({
        input: readableStream,
    });

    rl.on("line", (line) => {
        const game = createGameData(line);
        const isGamePossible = checkPossibleGame(game);

        muls.push(getFewestGameMul(game));

        if (isGamePossible) possibleGameIds.push(game.id);
    });

    rl.on("close", function() {
        // part 1 answer
        console.log(possibleGameIds.reduce((a, b) => a + b, 0));
        // part 2 answer
        console.log(muls.reduce((a, b) => a + b));
    });
}

read("input.txt");
