const {
  promises: { writeFile, readFile, stat, mkdir },
} = require('fs');
const csvWrite = require('csv-stringify');
const csvRead = require('csv-parse');

const csvFolderLocation = './server/local';
const csvLocation = (unit, channel) => `${csvFolderLocation}/unit${unit}_channel${channel}_blanking_codes.csv`;

const writeCsv = async (unit, channel, codes) => {
  const csv = await new Promise(resolve => csvWrite(codes, (err, data) => resolve(data)));
  // if the local folder doesnt exist, make it
  try {
    await stat(csvFolderLocation);
  } catch (e) {
    await mkdir(csvFolderLocation);
  }
  await writeFile(csvLocation(unit, channel), csv);
};

const readCsv = async (unit, channel) => {
  // check to see if that channel has a history
  try {
    await stat(csvLocation(unit, channel));
  } catch (e) {
    throw new Error("That channel doesn't have a blanking code history");
  }
  const csv = await readFile(csvLocation(unit, channel), 'utf8');
  return new Promise(resolve => csvRead(csv, (err, data) => resolve(data)));
};

const getDateLastModified = (unit, channel) =>
  new Promise(async resolve => {
    try {
      const { mtime } = await stat(csvLocation(unit, channel));
      mtime.setHours(mtime.getHours() - 8);
      resolve(mtime);
    } catch (e) {
      resolve(null);
    }
  });

const getCodeHistory = async (unit, channel) => {
  const csvArray = await readCsv(unit, channel).catch(() => [[null, null, null, null, null], []]);
  return {
    temperature: csvArray.pop()[0],
    codes: csvArray.reduce((obj, [target, highCode, highdBm, lowCode, lowdBm]) => {
      const codes = obj;
      codes[target] = { high: [highCode, highdBm], low: [lowCode, lowdBm] };
      return codes;
    }, {}),
  };
};

const getAllCodeHistory = async unit => {
  const codes = await Promise.all([1, 2, 3, 4, 5].map(channel => getCodeHistory(unit, channel)));
  const dates = await Promise.all([1, 2, 3, 4, 5].map(channel => getDateLastModified(unit, channel)));
  return { codes, date: dates.sort((a, b) => a < b)[0] };
};

const storeCodeHistory = async (unit, channel, codes, tempurature) => {
  const csvArray = Object.entries(codes).reduce(
    (
      csv,
      [
        target,
        {
          high: [highCode, highdBm],
          low: [lowCode, lowdBm],
        },
      ]
    ) => {
      csv.push([target, highCode, highdBm, lowCode, lowdBm]);
      return csv;
    },
    []
  );
  csvArray.push([tempurature, tempurature, tempurature, tempurature, tempurature]);
  await writeCsv(unit, channel, csvArray);
};

const oip3Location = unit => `${csvFolderLocation}/unit${unit}_oip3.csv`;

const getOIP3History = async (unit, print) => {
  let oip3Array;
  let date;
  try {
    await stat(oip3Location(unit));
    const csv = await readFile(oip3Location(unit), 'utf8');
    oip3Array = await new Promise(resolve => csvRead(csv, (err, data) => resolve(data)));
    if (print)
      date = await new Promise(async resolve => {
        const { mtime } = await stat(oip3Location(unit));
        mtime.setHours(mtime.getHours() - 8);
        resolve(mtime);
      });
  } catch (e) {
    oip3Array = [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0]];
  }
  return { oip3Array, date };
};

const storeOIP3History = async (unit, channel, oip3) => {
  try {
    await stat(csvFolderLocation);
  } catch (e) {
    await mkdir(csvFolderLocation);
  }
  let oip3Array;
  try {
    await stat(oip3Location(unit));
    const csv = await readFile(oip3Location(unit), 'utf8');
    oip3Array = await new Promise(resolve => csvRead(csv, (err, data) => resolve(data)));
  } catch (e) {
    oip3Array = [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0]];
  }
  oip3Array[+channel - 1][1] = oip3;
  const csv = await new Promise(resolve => csvWrite(oip3Array, (err, data) => resolve(data)));
  await writeFile(oip3Location(unit), csv);
};

module.exports = { getCodeHistory, getAllCodeHistory, storeCodeHistory, getOIP3History, storeOIP3History };
