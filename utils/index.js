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

function printMatrix(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            process.stdout.write(`${matrix[i][j]}`);
        }
        process.stdout.write('\n');
    }
}

function findAllIndexes(array, cb) {
    return (array = array.reduce(
        (a, value, i) => (cb(value) ? a.concat(i) : a),
        []
    ));
}

function zip(arr) {
    const zippedArr = [];
    const firstRow = arr[0];
    for (let i = 0; i < firstRow.length; i++) {
        const reversedRows = [];
        for (let j = 0; j < arr.length; j++) {
            reversedRows.push(arr[j][i]);
        }
        zippedArr.push(reversedRows);
    }
    return zippedArr;
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
    pipe,
    printMatrix,
    zip,
    findAllIndexes
};
