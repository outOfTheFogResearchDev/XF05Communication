const port = require('../utils/port');
const { getPower, resetAnalyzer, rfOff, rfOn, setAnalyzer, setPower } = require('../utils/cpp');

let channel;
let frequency;

const setBlanking = async decimalNumber => {
  await port.connection.writeCommand(`DW${channel}${decimalNumber.toString(16).toUpperCase()}`);
};

const setUp = async () => {
  await setAnalyzer(frequency);
  await setPower(frequency, -40);
  await rfOn();
  await setBlanking(170);
};

const setOutput = async target => {
  await setPower(frequency, target - 20);
  const power = await getPower();
  const difference = target - power;
  await setPower(frequency, target - 20 + difference);
};

module.exports = ch => {
  channel = ch;
  frequency = [1.25, 2.25, 4, 7.5, 15][ch];
  setUp();

  // stuff

  rfOff();
  resetAnalyzer();
};
