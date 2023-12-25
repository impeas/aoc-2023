const fs = require('fs');

const input = fs
    .readFileSync('input.txt', 'utf-8')
    .split(',')
    .map((x) => x.replace('\n', ''));

const hash = (s: string) =>
    s.split('').reduce((a, ch) => ((ch.charCodeAt(0) + a) * 17) % 256, 0);

const calcTotalPower = (lenses) => {
    const boxes = [];
    for (const lens of lenses) {
        if (lens.includes('-')) {
            const label = lens.split('-')[0];
            const labelHash = hash(label);
            const foundIndex = (boxes[labelHash] || []).findIndex(
                (lkLens) => lkLens.split('=')[0] === label
            );
            if (foundIndex !== -1) {
                boxes[labelHash].splice(foundIndex, 1);
            }
        } else if (lens.includes('=')) {
            const label = lens.split('=')[0];
            const labelHash = hash(label);
            if (!boxes[labelHash] || boxes[labelHash].length === 0) {
                boxes[labelHash] = [lens];
            } else {
                const foundIndex = boxes[labelHash].findIndex(
                    (lkLens) => lkLens.split('=')[0] === label
                );
                if (foundIndex !== -1) {
                    boxes[labelHash].splice(foundIndex, 1, lens);
                } else {
                    if (!boxes[labelHash]) {
                        boxes[labelHash] = [lens];
                    } else if (boxes[labelHash].length > 0) {
                        boxes[labelHash].push(lens);
                    }
                }
            }
        }
    }
    return boxes.reduce((acc, box, boxIndex) => {
        return (
            acc +
            box.reduce((acc, lens, lensIndex) => {
                return (
                    acc + (boxIndex + 1) * (lensIndex + 1) * lens.split('=')[1]
                );
            }, 0)
        );
    }, 0);
};

console.log({
    part1: input.reduce((acc, value) => {
        return hash(value) + acc;
    }, 0),
    part2: calcTotalPower(input)
});
