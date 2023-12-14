const fs = require('fs');
const path = require('path');

function sleep(t) {
    const start = Date.now();
    while (Date.now() - start < t);
}

function mapToNumArray(arr) {
    return arr.split(' ').reduce((acc, val) => {
        const num = parseInt(val);
        if (!isNaN(num)) acc.push(num);
        return acc;
    }, []);
}

function chunkArray(arr, size) {
    return arr.length > size
        ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
        : [arr];
}

function readFile(p) {
    return fs.readFileSync(path.resolve(p), 'utf-8');
}

const pipe =
    (...functions) =>
    (initialValue) =>
        functions.reduce((acc, fn) => fn(acc), initialValue);

module.exports = {
    mapToNumArray,
    chunkArray,
    readFile,
    sleep,
    pipe
};
