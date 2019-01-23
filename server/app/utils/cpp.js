const bindings = require('bindings');

module.exports = {
  getPower: bindings('getPower'),
  resetAnalyzer: bindings('resetAnalyzer'),
  rfOff: bindings('rfOff'),
  rfOn: bindings('rfOn'),
  setAnalyzer: bindings('setAnalyzer'),
  setPower: bindings('setPower'),
};
