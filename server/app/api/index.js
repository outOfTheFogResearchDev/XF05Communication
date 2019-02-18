const { Router } = require('express');
const axios = require('axios');
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
const automaticBlankingCodes = require('../algorithms/automaticBlankingCodes');
const getOIP3 = require('../algorithms/automaticOIP3');
const {
  getCodeHistory,
  getAllCodeHistory,
  storeCodeHistory,
  getOIP3History,
  storeOIP3History,
} = require('../utils/csv');

const api = Router();

const httpReq = axios.create();

httpReq.defaults.timeout = 200;

api.post('/connect', async (req, res) => {
  if (port.connected) res.sendStatus(201);
  else {
    try {
      await httpReq.post('http://localhost:3333/api/close_port');
    } catch (e) {} // eslint-disable-line no-empty
    if (await port.connect()) res.sendStatus(201);
    else res.sendStatus(400);
  }
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

blanking.get('/automatic_algorithm', async (req, res) => {
  const { unit, channel } = req.query;
  try {
    const codes = await automaticBlankingCodes(channel);
    const temperature = await port.connection.writeCommand('TA000', tempParser);
    await storeCodeHistory(unit, channel, codes, temperature);
    res.status(200).send({ codes, temperature });
  } catch (e) {
    res.status(400).send({ error: e.toString() });
  }
});

blanking.get('/history', async (req, res) => {
  const { unit, channel } = req.query;
  const { codes, temperature } = await getCodeHistory(unit, channel);
  res.status(200).send({ codes, temperature });
});

blanking.get('/full_history', async (req, res) => {
  const { unit } = req.query;
  const { codes, date } = await getAllCodeHistory(unit);
  res.status(200).send({ codes, printDate: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` });
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
  else if (mode === 'msfb') modeNumber = 3;
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

const oip3Endpoint = Router();

oip3Endpoint.get('/', async (req, res) => {
  const { unit, channel } = req.query;
  const oip3 = await getOIP3(+channel);
  await storeOIP3History(unit, channel, oip3);
  const temperature = await port.connection.writeCommand('TA000', tempParser);
  res.status(200).send({ oip3, temperature });
});

oip3Endpoint.get('/history', async (req, res) => {
  const { unit, print } = req.query;
  const { oip3Array, date } = await getOIP3History(unit, print);
  res
    .status(200)
    .send({ oip3Array, printDate: date ? `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` : null });
});

api.use('/oip3', oip3Endpoint);

api.get('/log', (req, res) => res.status(200).send({ log: port.connection.log() }));

api.get('/:command', async (req, res) => {
  const { command } = req.params;
  const response = await port.connection.writeCommand(command.toUpperCase(), identityParser);
  res.status(200).send({ response });
});

module.exports = api;
