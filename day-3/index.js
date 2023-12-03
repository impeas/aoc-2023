const fs = require('fs');

const file = fs.readFileSync('input.txt', 'utf8').split('\n');

const regex = /[-_!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/;
const numberRegex = /\d+/;

let gearSum = 0;
let savedPositions = [];

for (let i = 0; i < file.length; i++) {
    const line = file[i];
    const prevLine = file[i - 1];
    const nextLine = file[i + 1];
    const indexes = getAllIndexes(line.split(''));

    for (const index of indexes) {
        if (i > 0) {
            for (let j = index - 1; j <= index + 1; j++) {
                if (prevLine[j].match(numberRegex)) {
                    saveAdjacent(prevLine, i - 1, j);
                }
            }
        }

        for (let k = index - 1; k <= index + 1; k++) {
            if (line[k].match(numberRegex)) {
                saveAdjacent(line, i, k);
            }
        }

        if (i !== file.length - 1) {
            for (let l = index - 1; l <= index + 1; l++) {
                if (nextLine[l].match(numberRegex)) {
                    saveAdjacent(nextLine, i + 1, l);
                }
            }
        }

        if (savedPositions.length > 1) {
            if (!gearSum) gearSum = 0;

            const gear = savedPositions.reduce((a, b) => b.value * a, 1);
            gearSum += gear;
        }
        savedPositions = [];
    }
}

function saveAdjacent(line, row, col) {
    const digit = line[col];
    const digits = [digit];

    // stack prev digits
    let i = col - 1;
    while (line[i]?.match(numberRegex)) {
        digits.unshift(line[i]);
        i--;
    }

    if (savedPositions.some((p) => p.i === i + 1 && p.j === row)) {
        return false;
    }

    // stack next digits
    let j = col + 1;
    while (line[j]?.match(numberRegex)) {
        digits.push(line[j]);
        j++;
    }

    savedPositions.push({
        value: parseInt(digits.join('')),
        i: i + 1,
        j: row
    });

    return true;
}

function getAllIndexes(arr) {
    const indexes = [];

    arr.forEach((item, i) => {
        if (item.match(regex)) {
            indexes.push(i);
        }
    });

    return indexes;
}

console.log(gearSum);
