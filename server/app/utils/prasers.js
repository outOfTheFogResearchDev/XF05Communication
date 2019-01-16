const splitXParser = data => data.split('x')[1].trim();

module.exports = {
  successParser: (data, command) => command === data.slice(0, -1) && !+data.slice(-1),
  identityParser: data => data,
  tempParser: splitXParser,
  transferSwitchParser: data =>
    data
      .split(' ')
      .slice(1)
      .join(' '),
  blankingCodeReadParser: splitXParser,
  msfbSwitchParser: data => data.slice(6),
  msfbFilterCheckParser: data => `IND: ${data.slice(-1)}`,
};
