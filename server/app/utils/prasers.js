const splitTrimParser = split => data => data.split(split)[1].trim();

module.exports = {
  successParser: (data, command) => command === data.slice(0, -1) && !+data.slice(-1),
  identityParser: data => data,
  tempParser: splitTrimParser('x'),
  transferSwitchParser: data => (+splitTrimParser('IND:')(data) ? 'On' : 'Off'),
  blankingCodeReadParser: splitTrimParser('x'),
  filterBankIndParser: data => data === 'EA100 EXT Filter',
  msfbSwitchParser: data => data.slice(6),
  msfbFilterCheckParser: switchValue => data => +data.slice(-1) === switchValue,
};
