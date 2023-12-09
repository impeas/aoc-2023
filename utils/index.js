const fs = require('fs');

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

function readFile(path) {
    return fs.readFileSync(path, 'utf-8');
}

module.exports = {
    mapToNumArray,
    chunkArray,
    readFile
};
