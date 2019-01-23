const { Router } = require('express');
const port = require('../utils/port');
const {
  identityParser,
  successParser,
  tempParser,
  transferSwitchParser,
  blankingCodeReadParser,
  msfbSwitchParser,
  msfbFilterCheckParser,
} = require('../utils/prasers');

const api = Router();

api.post('/connect', async (req, res) => {
  if (port.connected) res.sendStatus(201);
  else if (await port.connect()) res.sendStatus(201);
  else res.sendStatus(400);
});

api.get('/temp', async (req, res) => {
  const temperature = await port.connection.writeCommand('TA000', tempParser);
  res.status(200).send({ temperature });
});

api.get('/transfer_switch', async (req, res) => {
  const { channel, on } = req.query;
  const status = await port.connection.writeCommand(`2A${channel}${+!+on}0`, transferSwitchParser);
  res.status(200).send({ status });
});

const blanking = Router();

blanking.post('/', async (req, res) => {
  const { channel, on } = req.body;
  const success = await port.connection.writeCommand(`BE${channel}${+on}0`, successParser);
  res.sendStatus(success ? 201 : 400);
});

blanking
  .route('/code')
  .get(async (req, res) => {
    const { channel } = req.query;
    const code = await port.connection.writeCommand(`DR${channel}10`, blankingCodeReadParser);
    res.status(200).send({ code });
  })
  .post(async (req, res) => {
    const { channel, code } = req.body;
    const success = await port.connection.writeCommand(`DW${channel}${code.toUpperCase()}`, successParser);
    res.sendStatus(success ? 201 : 400);
  });

api.use('/blanking', blanking);

const filterBank = Router();

filterBank.get('/indicator', async (req, res) => {
  const { channel } = req.query;
  const status = await port.connection.writeCommand(`EA${channel}00`, identityParser);
  res.status(200).send({ status });
});

filterBank.post('/mode', async (req, res) => {
  const { channel, mode } = req.body;
  let modeNumber;
  if (mode === 'low') modeNumber = 1;
  else if (mode === 'high') modeNumber = 2;
  else if (mode === 'break') modeNumber = 3;
  const success = await port.connection.writeCommand(`DA${channel}${modeNumber}0`, successParser);
  res.sendStatus(success ? 201 : 400);
});

api.use('/filter_bank', filterBank);

api.post('/manual_attenuation', async (req, res) => {
  const { channel, level } = req.body;
  const success = await port.connection.writeCommand(`5A1${channel}${level.toUpperCase()}`, successParser);
  res.sendStatus(success ? 201 : 400);
});

api.post('/automatic_attenuation', async (req, res) => {
  const { channel } = req.body;
  const success = await port.connection.writeCommand(`5A0${channel}0`, successParser);
  res.sendStatus(success ? 201 : 400);
});

const msfbSwitch = Router();

msfbSwitch.get('/filter', async (req, res) => {
  const { filter } = req.query;
  let switchValue = 0;
  if (filter === '3') switchValue = 1;
  else if (filter === '4') switchValue = 2;
  else if (filter === 'both') switchValue = 3;
  const status = await port.connection.writeCommand(`MP${switchValue}00`, msfbSwitchParser);
  res.status(200).send({ status });
});

msfbSwitch.get('/indicator', async (req, res) => {
  const indicator = await port.connection.writeCommand(`MS000`, msfbFilterCheckParser);
  res.status(200).send({ indicator });
});

api.use('/msfb_switch', msfbSwitch);

api.get('/:command', async (req, res) => {
  const { command } = req.params;
  const response = await port.connection.writeCommand(command.toUpperCase(), identityParser);
  res.status(200).send({ response });
});

module.exports = api;
