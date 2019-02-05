const bindings = require('bindings');

const gp = bindings('getPower');

module.exports = {
  getPower: async () => {
    let data = await gp();

    data = data.split('E');
    const num = +data[0];
    const e = +data[1].split('\n')[0];

    const power = num * 10 ** e;

    return Math.round(power * 10) / 10;
  },
  resetAnalyzer: bindings('resetAnalyzer'),
  rfOff: bindings('rfOff'),
  rfOn: bindings('rfOn'),
  setAnalyzer: bindings('setAnalyzer'),
  setPower: bindings('setPower'),
  setRefLevel: bindings('setRefLevel'),
};
