const port = require('../utils/port');
const { getPower, setPower, rfOn, rfOff, setUpOIP3, setDownOIP3, setAnalyzer, resetAnalyzer } = require('../utils/cpp');

const setOutput = async (generator, frequency) => {
  let input = -30;
  const target = -10;
  await setAnalyzer(frequency);
  await setPower(frequency, input, generator);
  await rfOn(generator);
  await new Promise(resolve => setTimeout(resolve, 100));
  let power = await getPower();
  let difference = target - power;
  input += difference;
  await setPower(frequency, input, generator);
  await new Promise(resolve => setTimeout(resolve, 100));
  power = await getPower();
  difference = target - power;
  input += difference;
  await setPower(frequency, input, generator);
};

const setUp = async channel => {
  const IM3 = [1.24, 2.24, 3.99, 7.5, 15][channel - 1];
  const f1 = IM3 - 0.02;
  const f2 = IM3 - 0.01;
  port.connection.writeCommand(`5A1${channel}1`); // Turn attenuation off
  await new Promise(resolve => setTimeout(resolve, 200));
  await setOutput(1, f1);
  await setOutput(2, f2);
  await resetAnalyzer();
  await setUpOIP3(IM3);
};

const setDown = async () => {
  await setDownOIP3();
  await rfOff(1);
  await rfOff(2);
};

const OIP3Calculation = (power, cableLoss) => -10 + (-10 - power) / 2 + cableLoss;

module.exports = async channel => {
  await setUp(channel);
  const power = await getPower();
  await setDown();
  return Math.round(OIP3Calculation(power, [0.6, 0.8, 1.1, 1.8, 2.8][channel - 1]));
};
