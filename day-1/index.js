const fs = require('fs');

const validDigit = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9"
}

const regex = /one|two|three|four|five|six|seven|eight|nine/g;
const reverseRegex = /eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/g; // Reversed patterns

const fileToArray = (path) => {
  return fs.readFileSync(path, 'utf8').split('\n');
}

const getCalibrationInts = (strings) => {
  return strings.map(calibrateString).filter(x => x);
}

const getNum = (string, which) => {
  if (string) {
    if (which === 'first') {
      const matches = string.match(regex);
      return validDigit[matches?.[0]];
    }

    if (which === 'last') {
      const x = string.split('').reverse().join('').match(reverseRegex);

      if (x) {
        const y = x[0].split('').reverse().join('');
        return validDigit[y];
      }
    }
  }
}

const calibrateString = (string) => {
  const extractedInt = string.replace(/\D/g, '');


  if (extractedInt.length === 0) {
    let a = getNum(string, 'first');
    let b = getNum(string, 'last');

    return parseInt(a + b);
  }

  let firstChar = extractedInt[0];
  let lastChar = extractedInt.charAt(extractedInt.length - 1);

  const indexOfFirstChar = string.indexOf(firstChar);
  const indexOfLastChar = string.length - string.split('').reverse().join('').indexOf(lastChar) - 1;

  const afterLastChar = string.slice(indexOfLastChar + 1);
  const beforeFirstChar = string.slice(0, indexOfFirstChar);

  const foundLastNum = getNum(afterLastChar, 'last');
  const foundFirstNum = getNum(beforeFirstChar, 'first');


  if (foundFirstNum) firstChar = foundFirstNum;
  if (foundLastNum) lastChar = foundLastNum;

  if (firstChar && lastChar) {
    return Number(`${firstChar}${lastChar}`);
  }
}

const sumValues = (values) => values.reduce((a, b) => a + b, 0);

try {
  const strings = fileToArray('file.txt');
  const calibratedStrings = getCalibrationInts(strings);
  const sum = sumValues(calibratedStrings);

  console.log({ sum });
} catch (e) {
  console.log('Error:', e.stack);
}
