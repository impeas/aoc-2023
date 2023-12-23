const { readFile, zip } = require('../utils');

const patterns = readFile('input.txt')
    .split('\n\n')
    .map((x) =>
        x
            .split('\n')
            .filter((x) => x)
            .map((x) => x.split(''))
    );

const determine_eq = (part_line: string[]) => {
    if (part_line.length % 2 !== 0 || part_line.length === 0) return false;
    const len = part_line.length;
    const first_half = part_line.slice(len / 2).toString();
    const second_half = part_line
        .slice(0, len / 2)
        .reverse()
        .toString();
    return first_half === second_half;
};

const cnts_of_left = (line: string[]) => {
    const len = line.length;
    const reflection_indexes = [];
    for (let i = 0; i < len - 1; i++) {
        const part_line = line.slice(i);
        const is_refl = determine_eq(part_line);
        if (is_refl) reflection_indexes.push(len - part_line.length / 2);
    }
    for (let i = 1; i < len - 1; i++) {
        const part_line = line.slice(0, -i);
        const is_refl = determine_eq(part_line);
        if (is_refl) reflection_indexes.push(len - i - part_line.length / 2);
    }
    return reflection_indexes;
};

const is_mirror = (mirror) => {
    const cnts = [];
    for (const line of mirror) {
        const cnt = cnts_of_left(line);
        if (!cnt) return false;
        cnts.push(cnt);
    }
    const unique = cnts.reduce((acc, value) => {
        return value.filter((num) => acc.includes(num));
    });
    return unique;
};

const get_pattern_info = (pattern) => {
    const vertical_mirror = is_mirror(pattern);
    const horizontal_mirror = is_mirror(zip(pattern));

    return [vertical_mirror, horizontal_mirror];
};

const count_patterns = (patterns) => {
    const left = [];
    const top = [];
    for (const pattern of patterns) {
        const [from_left, above_top] = get_pattern_info(pattern);
        left.push(from_left);
        top.push(above_top);
    }
    const left_sum = left.reduce((acc, value) => acc + value, 0);
    const top_sum = top.reduce((acc, value) => acc + value, 0);
    return left_sum + 100 * top_sum;
};

const count_smudge_patterns = (patterns) => {
    const left = [];
    const top = [];
    for (const pattern of patterns) {
        const [op_from_left, op_above_top] = get_pattern_info(pattern);
        const local_left = [];
        const local_top = [];
        const possible_patterns = create_every_possible_pattern(pattern);
        for (const possible_pattern of possible_patterns) {
            const [from_left, above_top] = get_pattern_info(possible_pattern);
            const from_left_value = from_left.filter(
                (x) => x !== op_from_left[0]
            );
            const above_top_value = above_top.filter(
                (x) => x !== op_above_top[0]
            );
            local_left.push(from_left_value);
            local_top.push(above_top_value);
        }
        left.push(local_left.flat()[0]);
        top.push(local_top.flat()[0]);
    }
    const left_sum = left
        .filter((x) => x)
        .reduce((acc, value) => acc + value, 0);
    const top_sum = top.filter((x) => x).reduce((acc, value) => acc + value, 0);
    return left_sum + 100 * top_sum;
};

const create_every_possible_pattern = (pattern) => {
    const every_pattern = [];
    for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[i].length; j++) {
            const new_patt = JSON.parse(JSON.stringify(pattern));
            if (new_patt[i][j] === '#') {
                new_patt[i][j] = '.';
            } else {
                new_patt[i][j] = '#';
            }

            every_pattern.push(new_patt);
        }
    }
    return every_pattern;
};

const cnt = count_patterns(patterns);
const cnt_smudge = count_smudge_patterns(patterns);

console.log({ cnt, cnt_smudge });
