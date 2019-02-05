const port = require('../utils/port');
const { getPower, resetAnalyzer, rfOff, rfOn, setAnalyzer, setPower, setRefLevel } = require('../utils/cpp');

let channel;
let frequency;
let target;
let input;
let outputOffset;
let code;
let results;

const setBlanking = async decimalNumber => {
  port.connection.writeCommand(`DW${channel}${decimalNumber.toString(16).toUpperCase()}`);
  await new Promise(resolve => setTimeout(resolve, 200));
};

const setUp = async ch => {
  channel = ch;
  frequency = [1.25, 2.25, 4, 7.5, 15][channel - 1];
  outputOffset = [-0.6, -0.8, -1.1, -1.8, -2.8][channel - 1];
  code = 165;
  results = {};
  await setAnalyzer(frequency);
  await setRefLevel(10);
  await setPower(frequency, -15);
  port.connection.writeCommand(`BE${channel}10`);
  await new Promise(resolve => setTimeout(resolve, 200));
  await setBlanking(170);
  port.connection.writeCommand(`5A1${channel}1`);
  await new Promise(resolve => setTimeout(resolve, 200));
  await rfOn();
};

const setDown = async () => {
  await rfOff();
  await resetAnalyzer();
  await setRefLevel(0);
  port.connection.writeCommand(`BE${channel}00`);
  await new Promise(resolve => setTimeout(resolve, 200));
  port.connection.writeCommand(`5A0${channel}0`);
  await new Promise(resolve => setTimeout(resolve, 200));
};

const setOutput = async () => {
  await setBlanking(170);
  await setPower(frequency, target - 20);
  await new Promise(resolve => setTimeout(resolve, 10));
  const power = await getPower();
  const difference = target - power;
  input = target - 20 + difference;
  if (input > 0) {
    await rfOff();
    throw new Error(`Error with blanking: Blanked at code AA`);
  }
  await setPower(frequency, input);
};

const findBlankingPower = async (power, type) => {
  await setPower(frequency, power);
  const check = await getPower();
  if (check > -40) {
    if (check - target > 1.5) results[target][type][1] = '> 1.5';
    else {
      results[target][type][1] = check;
      await findBlankingPower(power + 0.1, type);
    }
  }
};

const findBlankingValues = async () => {
  results[target].low = [code.toString(16).toUpperCase()];
  await setBlanking(170);
  await setPower(frequency, input - 4);
  await setBlanking(code);
  await findBlankingPower(input - 3.9, 'low');

  if (results[target].low[1] >= target) {
    results[target].high = results[target].low.slice();
    code -= 1;
    results[target].low = [code.toString(16).toUpperCase()];
    await setBlanking(170);
    await setPower(frequency, input - 4);
    await setBlanking(code);
    await findBlankingPower(input - 3.9, 'low');
  } else {
    results[target].high = [(code + 1).toString(16).toUpperCase()];
    await setBlanking(170);
    await setPower(frequency, input - 4);
    await setBlanking(code + 1);
    await findBlankingPower(input - 3.9, 'high');
    if (results[target].high[1] < target) {
      if (code >= 166) {
        await rfOff();
        throw new Error(`Error with blanking: Bid not blank at a6`);
      }
      code += 2;
      await findBlankingValues();
    }
  }
};

const findSurroundingBlankingCodes = async () => {
  await setBlanking(code);
  const power = await getPower();
  if (power < -15) {
    await findBlankingValues();
  } else {
    code -= 1;
    if (code > 111) await findSurroundingBlankingCodes();
  }
};

const outputCycle = async output => {
  if (output < -10) return;
  target = output + outputOffset;
  await setOutput();
  results[target] = {};
  await findSurroundingBlankingCodes();
  await outputCycle(output - 5);
};

module.exports = async ch => {
  await setUp(ch);
  await outputCycle(5);
  await setDown();
  return results;
};
