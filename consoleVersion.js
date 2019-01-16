const SerialPort = require('serialport');
const readline = require('readline');

const callback = data => console.log(data); // eslint-disable-line no-console
let handleData;
let response = '';
let port;

const readResponse = () => {
  const indexOfClose = response.indexOf('}');
  if (indexOfClose === -1) return;
  const data = response.slice(1, indexOfClose);
  response = response.slice(indexOfClose + 1);
  if (data === 'Power RESET') return;
  if (data.length > 5) {
    callback(data);
    return;
  }
  handleData();
};

handleData = () => {
  if (response[0] === '{') readResponse();
  if (response) {
    response = response.slice(1);
    handleData();
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readStdin = () => {
  rl.question('', command => {
    if (command.length === 5) port.write(`{${command.toUpperCase()}}`);
    readStdin();
  });
};

SerialPort.list().then(([{comName}]) => {
  port = new SerialPort(comName, {
    baudRate: 115200,
    parity: 'even',
    stopBits: 1,
    dataBits: 8,
    flowControl: 'none',
    parser: new SerialPort.parsers.Readline(),
  });

  port.on('readable', () => {
    response += port.read().toString('utf8');
    handleData();
  });

  readStdin();
});
