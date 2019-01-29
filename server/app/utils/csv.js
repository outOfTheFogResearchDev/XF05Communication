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

const getCodeHistory = async (unit, channel) => {
  const csvArray = await readCsv(unit, channel);
  return csvArray.reduce((obj, [target, highCode, highdBm, lowCode, lowdBm]) => {
    const codes = obj;
    codes[target] = { high: [highCode, highdBm], low: [lowCode, lowdBm] };
    return codes;
  }, {});
};

const getAllCodeHistory = async unit => Promise.all([1, 2, 3, 4, 5].map(channel => getCodeHistory(unit, channel)));

const storeCodeHistory = async (unit, channel, codes) => {
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
  await writeCsv(unit, channel, csvArray);
};

module.exports = { getCodeHistory, getAllCodeHistory, storeCodeHistory };
