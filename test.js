const SerialPort = require('serialport');
const readline = require('readline');
const port = new SerialPort('COM4', {
  baudRate: 115200,
  parity: 'even',
  stopBits: 1,
  dataBits: 8,
  flowControl: 'none',
  parser: new SerialPort.parsers.Readline(),
});

port.on('open', function() {
  console.log('open');
  port.on('data', function(data) {
    console.log('data: ', data.toString('utf8'));
  });
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const repeat = () => {
  rl.question('', command => {
    port.write(command);

    rl.close();
    repeat();
  });
};

repeat();
