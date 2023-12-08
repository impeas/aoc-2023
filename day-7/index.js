const fs = require('fs');
const hands = fs.readFileSync('input.txt', 'utf-8').split('\n');
const cards = 'J23456789TQKA'.split('');
const evaluations = [
    'HIGH',
    'PAIR',
    'PAIRS',
    'THREES',
    'HOUSE',
    'FOURS',
    'FIVES'
];
const allScores = [];
const mapEval = {
    FIVES: ['5,0,0', '4,0,1', '3,0,2', '2,0,3', '0,0,4', '0,0,5'],
    FOURS: ['0,0,3', '4,0,0', '3,0,1', '2,0,2'],
    HOUSE: ['2,3,0', '3,2,0', '2,2,1'],
    THREES: ['0,0,2', '3,0,0', '2,0,1'],
    PAIRS: ['2,2,0'],
    PAIR: ['0,0,1', '2,0,0']
};

function evaluateCard(card, jokers = 0) {
    for (const [k, v] of Object.entries(mapEval)) {
        if (v.includes([card[0] || 0, card[1] || 0, jokers].toString()))
            return k;
    }
    return 'HIGH';
}

for (let i = 0; i < hands.length; i++) {
    const score = hands[i]
        .split(' ')[0]
        .split('')
        .reduce((acc, value) => {
            return {
                ...acc,
                [value]: acc[value] ? acc[value] + 1 : 1,
                orig: hands[i]
            };
        }, {});

    allScores.push(score);
}

const getEval = (card) => {
    const evList = Object.entries(card).filter(
        ([k, v]) => [2, 3, 4, 5].includes(v) && k !== 'J'
    );
    return evaluateCard(
        evList.map((x) => x[1]),
        card['J']
    );
};

const sorted = allScores.sort(compareCards);

let totalSum = 0;

for (let i = 0; i < sorted.length; i++) {
    const amt = sorted[i].orig.split(' ')[1];
    const sum = parseInt(amt);
    totalSum += sum * (i + 1);
}

function compareCards(a, b) {
    if (evaluations.indexOf(getEval(a)) < evaluations.indexOf(getEval(b))) {
        return -1;
    } else if (
        evaluations.indexOf(getEval(a)) > evaluations.indexOf(getEval(b))
    ) {
        return 1;
    }

    const hA = a.orig.split(' ')[0];
    const hB = b.orig.split(' ')[0];
    for (let i = 0; i < 5; i++) {
        const indexA = cards.indexOf(hA[i]);
        const indexB = cards.indexOf(hB[i]);

        if (indexA < indexB) {
            return -1;
        } else if (indexA > indexB) {
            return 1;
        }
    }

    return 0;
}

console.log({ part2Answer: totalSum });
