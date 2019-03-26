import React, { Fragment, Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import PrintTable from './containers/printTable';
import PrintOIP3 from './containers/printOIP3';
import Header from './containers/header';
import WiringControlCheck from './containers/wiringControlCheck';
import BlankingCodesCheck from './containers/blankingCodesCheck';
import MSFBControlCheck from './containers/msfbControlCheck';
import OIP3Check from './containers/oip3Check';

const PrintTitle = styled.h1`
  display: inline-block;
  font-size: 100%;
`;

const PrintUnit = styled.h1`
  display: inline-block;
  font-size: 100%;
`;

const PrintDate = styled.h1`
  display: inline-block;
  font-size: 100%;
  float: right;
`;

const Container = styled.div`
  display: grid;
  grid:
    'wiring blanking'
    'msfb oip3';
  margin: 15px 5px;
  width: 900px;
  gap: 10px;
`;

const ping = async () => {
  await axios.post('/ping');
};

const _window = async (type, string) => {
  await axios.post('/ping/in_operation');
  const answer = window[type](string); // eslint-disable-line no-alert
  return axios.post('/ping/out_operation').then(() => answer);
};

const _confirm = string => _window('confirm', string);

const _alert = string => _window('alert', string);

const httpReq = axios.create();

httpReq.defaults.timeout = 500;

const get = (url, params = {}, tries = 0) =>
  new Promise(async resolve => {
    try {
      resolve(await httpReq.get(url, params));
    } catch (e) {
      if (tries >= 5) {
        await _alert('issue talking with the XF05 box');
        resolve({ data: {} });
      } else {
        resolve(get(url, params, tries + 1));
      }
    }
  });

const post = (url, params = {}, tries = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(await httpReq.post(url, params));
    } catch (e) {
      if (tries >= 5) {
        await _alert('issue talking with the XF05 box');
        reject(e);
      } else resolve(post(url, params, tries + 1));
    }
  });

const resolveSyncronously = async pArray => {
  if (!pArray.length) return [];
  let data = {};
  return pArray
    .pop()()
    .then(d => {
      data = d;
      resolveSyncronously(pArray);
    })
    .then(results => [data].concat(results));
}; // returns values in reverse order

const parseBlankingCodesForDisplay = codes =>
  Object.entries(codes)
    .sort(([a], [b]) => +a - +b)
    .reduce(
      (
        response,
        [
          target,
          {
            high: [highCode, highdBm],
            low: [lowCode, lowdBm],
          },
        ],
        i
      ) => `${response}_${i}|${target}|${lowdBm}:${lowCode}/${highdBm}:${highCode}`,
      ''
    );

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unit: '',
      channel: '',
      customCommand: '',
      response: 'No Connection',
      connected: false,
      transferSwitchToggled: false,
      filterBankState: '',
      adjacentAttenuationState: false,
      attValue: 0,
      blankingSwitchToggled: false,
      blankingValue: '',
      bandTwoSwitchToggled: false,
      bandThreeSwitchToggled: false,
      bandThreeCheckRadioState: '',
      printCodes: [],
      printOIP3: [],
      printDate: '',
      printing: false,
    };

    this.getBlankingCodes = this.addChannelCheck(this.getBlankingCodes);
    this.getOIP3History = this.getOIP3History.bind(this);
    this.togglePrint = this.togglePrint.bind(this);
    this.connect = this.connect.bind(this);
    this.handleUnitNumberChange = this.handleUnitNumberChange.bind(this);
    this.handleCheckCommunication = this.addConnectedCheck(this.handleCheckCommunication);
    this.handleTemperatureClick = this.addConnectedCheck(this.handleTemperatureClick);
    this.handleCustomCommandChange = this.handleCustomCommandChange.bind(this);
    this.handleCustomCommandSubmit = this.addConnectedCheck(this.handleCustomCommandSubmit);
    this.handleChannelSwitch = this.handleChannelSwitch.bind(this);
    this.handleTransferSwitchToggle = this.addConnectedCheck(this.addChannelCheck(this.handleTransferSwitchToggle));
    this.handleFilterBankStateSwitch = this.addConnectedCheck(this.addChannelCheck(this.handleFilterBankStateSwitch));
    this.handleFilterBankIndClick = this.addConnectedCheck(this.addChannelCheck(this.handleFilterBankIndClick));
    this.handleAdjacentAttenuationToggle = this.addConnectedCheck(
      this.addChannelCheck(this.handleAdjacentAttenuationToggle)
    );
    this.handleAutoAttClick = this.addConnectedCheck(this.addChannelCheck(this.handleAutoAttClick));
    this.handleAttChange = this.addConnectedCheck(this.addChannelCheck(this.handleAttChange));
    this.handleBlankingSwitchToggle = this.addConnectedCheck(this.addChannelCheck(this.handleBlankingSwitchToggle));
    this.handleBlankingReadClick = this.addConnectedCheck(this.addChannelCheck(this.handleBlankingReadClick));
    this.handleBlankingWriteClick = this.addConnectedCheck(this.addChannelCheck(this.handleBlankingWriteClick));
    this.handleBlankingChange = this.handleBlankingChange.bind(this);
    this.handleBandTwoCheckSwitchToggle = this.addConnectedCheck(this.handleBandTwoCheckSwitchToggle);
    this.handleBandThreeCheckSwitchToggle = this.addConnectedCheck(this.handleBandThreeCheckSwitchToggle);
    this.handleBandThreeCheckRadioChange = this.addConnectedCheck(this.handleBandThreeCheckRadioChange);
    this.handleAutomaticBlankingCodesClick = this.addConnectedCheck(
      this.addChannelCheck(this.handleAutomaticBlankingCodesClick)
    );
    this.handleAutomaticOIP3Click = this.addConnectedCheck(this.addChannelCheck(this.handleAutomaticOIP3Click));
  }

  async componentDidMount() {
    await this.connect();
    setInterval(ping, 1000);
  }

  componentDidUpdate() {
    const { printing } = this.state;
    if (printing) {
      this.print();
    }
  }

  setStateFocusCommandInput(state, func = () => {}) {
    this.setState(state, async () => {
      await func();
      document.getElementById('command-input').focus();
    });
  }

  async getBlankingCodes() {
    const { unit, channel } = this.state;
    const {
      data: { codes, temperature },
    } = await axios.get('/api/blanking/history', { params: { unit, channel } });
    this.displayBlankingCodes(codes, temperature);
  }

  async getOIP3History() {
    const { unit } = this.state;
    if (!unit) return;
    const {
      data: { oip3Array },
    } = await get('/api/oip3/history', { params: { unit } });
    this.setStateFocusCommandInput({ response: oip3Array });
  }

  print() {
    window.print();
    this.togglePrint();
  }

  async togglePrint(type) {
    const { printing, unit } = this.state;
    if (!unit) return;
    if (!printing) {
      if (type === 'blanking') {
        const {
          data: { codes: printCodes, printDate },
        } = await axios.get('/api/blanking/full_history', { params: { unit } });
        this.setState({ printing: true, printCodes, printDate });
      } else if (type === 'oip3') {
        const {
          data: { oip3Array: printOIP3, printDate },
        } = await get('/api/oip3/history', { params: { unit, print: true } });
        this.setState({ printing: true, printOIP3, printDate });
      }
    } else {
      this.setState({ printing: false, printCodes: [], printOIP3: [], printDate: '' });
    }
  }

  async connect(hard = false) {
    const { connected } = this.state;
    if (hard) {
      try {
        await post('/api/hard_connect');
        this.setState({ connected: true, response: 'Connected to XF05' });
      } catch (e) {
        await _alert('Issue opening COM port to XF05, please connect the USB and click "connect"');
        this.setState({ connected: false });
      }
    } else if (connected) this.setState({ response: 'Connected to XF05' });
    else {
      try {
        await post('/api/connect');
        this.setState({ connected: true, response: 'Connected to XF05' });
      } catch (e) {
        await _alert('Issue opening COM port to XF05, please connect the USB and click "connect"');
        this.setState({ connected: false });
      }
    }
  }

  addConnectedCheck(func) {
    return (...args) => {
      const { connected } = this.state;
      if (connected) func.apply(this, args);
      else await _alert('You are not connected to the COM port, please click "Connect"');
    };
  }

  addChannelCheck(func) {
    return (...args) => {
      const { channel } = this.state;
      if (channel) func.apply(this, args);
    };
  }

  async handleCheckCommunication() {
    try {
      const temp = await get('/api/temp');
      if (temp) this.setStateFocusCommandInput({ response: 'Communication Successful' });
      else throw new Error();
    } catch (e) {
      this.setState({ response: 'Communication Unsuccessful' });
    }
  }

  handleUnitNumberChange({ target: { value } }) {
    this.setState({ unit: +value });
  }

  handleCustomCommandChange({ target: { value: customCommand } }) {
    this.setState({ customCommand });
  }

  async handleCustomCommandSubmit() {
    const { customCommand } = this.state;
    if (customCommand.length !== 5) return;
    const {
      data: { response },
    } = await get(`/api/${customCommand}`);
    this.setStateFocusCommandInput({ response, customCommand: '' });
  }

  async handleChannelSwitch({ target: { value } }) {
    const {
      unit,
      channel,
      transferSwitchToggled,
      filterBankState,
      adjacentAttenuationState,
      attValue,
      blankingSwitchToggled,
      bandTwoSwitchToggled,
      bandThreeSwitchToggled,
      bandThreeCheckRadioState,
    } = this.state;
    if (!unit || channel === +value) return;
    const resets = [];
    if (transferSwitchToggled) resets.push(() => get('/api/transfer_switch', { params: { channel, on: 0 } }));
    if (filterBankState) resets.push(() => post('/api/filter_bank/mode', { channel, mode: 'msfb' }));
    if (adjacentAttenuationState) {
      if (channel + 1 <= 5) resets.push(() => post('/api/automatic_attenuation', { channel: channel + 1 }));
      if (channel - 1 >= 1) resets.push(() => post('/api/automatic_attenuation', { channel: channel - 1 }));
    }
    if (attValue !== 0) resets.push(() => post('/api/automatic_attenuation', { channel }));
    if (blankingSwitchToggled) resets.push(() => post('/api/blanking', { channel, on: 0 }));
    if (bandThreeCheckRadioState) resets.push(() => get('/api/msfb_switch/filter', { params: { filter: 0 } }));
    if (bandTwoSwitchToggled) {
      [1, 3].forEach(ch => resets.push(() => post('/api/automatic_attenuation', { channel: ch })));
      if (channel !== 2) resets.push(() => get('/api/transfer_switch', { params: { channel: 2, on: 0 } }));
    }
    if (bandThreeSwitchToggled) {
      [1, 2, 4].forEach(ch => resets.push(() => post('/api/automatic_attenuation', { channel: ch })));
      if (channel !== 3) resets.push(() => get('/api/transfer_switch', { params: { channel: 3, on: 0 } }));
    }
    try {
      await resolveSyncronously(resets);
    } catch (e) {
      // eslint-disable-line no-empty
    } finally {
      this.setStateFocusCommandInput({
        channel: +value,
        transferSwitchToggled: false,
        filterBankState: '',
        adjacentAttenuationState: false,
        attValue: 0,
        blankingSwitchToggled: false,
        blankingValue: '',
        bandTwoSwitchToggled: false,
        bandThreeSwitchToggled: false,
        bandThreeCheckRadioState: '',
      });
    }
  }

  async handleTemperatureClick() {
    const {
      data: { temperature },
    } = await get('/api/temp');
    this.setStateFocusCommandInput({ response: `${temperature}°C` });
  }

  async handleTransferSwitchToggle() {
    const { channel, transferSwitchToggled, bandTwoSwitchToggled, bandThreeSwitchToggled } = this.state;
    const that = this;
    await get('/api/transfer_switch', { params: { channel, on: +!transferSwitchToggled } }).then(
      ({ data: { status: response } }) => {
        const state = { response };
        if (response) {
          state.transferSwitchToggled = !transferSwitchToggled;
          state.bandTwoSwitchToggled = channel === 2 ? !transferSwitchToggled : bandTwoSwitchToggled;
          state.bandThreeSwitchToggled = channel === 3 ? !transferSwitchToggled : bandThreeSwitchToggled;
        }
        that.setStateFocusCommandInput(state);
      }
    );
  }

  async handleFilterBankStateSwitch({ target: { value: mode } }) {
    const { channel } = this.state;
    try {
      await post('/api/filter_bank/mode', { channel, mode });
      this.setStateFocusCommandInput({ response: `Filter Bank Mode Set: ${mode}`, filterBankState: mode });
    } catch (e) {
      this.setStateFocusCommandInput({ response: 'Failed' });
    }
  }

  async handleFilterBankIndClick() {
    const { channel } = this.state;
    const {
      data: { status: response },
    } = await get('/api/filter_bank/indicator', { params: { channel } });
    this.setStateFocusCommandInput({ response });
  }

  async handleAdjacentAttenuationToggle() {
    const { channel, adjacentAttenuationState, transferSwitchToggled } = this.state;
    const nullF = () => {};
    const { handleTransferSwitchToggle } = this;
    if (adjacentAttenuationState) {
      try {
        await resolveSyncronously(
          channel + 1 <= 5 ? post('/api/automatic_attenuation', { channel: channel + 1 }) : nullF,
          channel - 1 >= 1 ? post('/api/automatic_attenuation', { channel: channel - 1 }) : nullF
        );
        this.setStateFocusCommandInput(
          { adjacentAttenuationState: false },
          transferSwitchToggled ? handleTransferSwitchToggle : nullF
        );
      } catch (e) {} // eslint-disable-line no-empty
    } else {
      try {
        await resolveSyncronously(
          channel + 1 <= 5 ? post('/api/manual_attenuation', { channel: channel + 1, level: 'D' }) : nullF,
          channel - 1 >= 1 ? post('/api/manual_attenuation', { channel: channel - 1, level: 'D' }) : nullF
        );
        this.setStateFocusCommandInput(
          { adjacentAttenuationState: true },
          !transferSwitchToggled ? handleTransferSwitchToggle : nullF
        );
      } catch (e) {} // eslint-disable-line no-empty
    }
  }

  async handleAutoAttClick() {
    const { channel } = this.state;
    try {
      await post('/api/automatic_attenuation', { channel });
      this.setStateFocusCommandInput({ response: 'Attenuation Set to Auto', attValue: 0 });
    } catch (e) {
      this.setStateFocusCommandInput({ response: 'Failed' });
    }
  }

  async handleAttChange({ target: { value: level } }) {
    const { channel } = this.state;
    if (!+level || +level < 1 || +level > 13) return;
    try {
      await post('/api/manual_attenuation', { channel, level: (+level).toString(16) });
      this.setState({ response: `Attenuation Set: ${level}`, attValue: level });
    } catch (e) {
      this.setState({ response: 'Failed' });
    }
  }

  async handleBlankingSwitchToggle() {
    const { channel, blankingSwitchToggled } = this.state;
    const that = this;
    try {
      await post('/api/blanking', { channel, on: +!blankingSwitchToggled }).then(() =>
        that.setStateFocusCommandInput({
          response: `Blanking ${!blankingSwitchToggled ? 'On' : 'Off'}`,
          blankingSwitchToggled: !blankingSwitchToggled,
        })
      );
    } catch (e) {
      this.setStateFocusCommandInput({ response: 'Failed' });
    }
  }

  async handleBlankingReadClick() {
    const { channel } = this.state;
    const {
      data: { code },
    } = await get('/api/blanking/code', { params: { channel } });
    this.setStateFocusCommandInput({ response: `Blanking Code Read: ${code}` });
  }

  async handleBlankingWriteClick() {
    const { channel, blankingValue: code } = this.state;
    if (!code) return;
    try {
      await post('/api/blanking/code', { channel, code: '0'.repeat(2 - code.length) + code });
      this.setStateFocusCommandInput({ response: `Blanking Code Written: ${code}` });
    } catch (e) {
      this.setStateFocusCommandInput({ response: 'Failed' });
    }
  }

  handleBlankingChange({ target: { value: blankingValue } }) {
    const blankingValueInt = parseInt(blankingValue, 16);
    if (blankingValue === '' || (blankingValueInt && blankingValueInt >= 0 && blankingValueInt <= 175))
      this.setState({ blankingValue });
  }

  async handleBandTwoCheckSwitchToggle() {
    const { channel, transferSwitchToggled, bandTwoSwitchToggled } = this.state;
    const that = this;
    let commands = [];
    if (bandTwoSwitchToggled) {
      commands = [1, 3].map(ch => () => post('/api/automatic_attenuation', { channel: ch }));
    } else {
      commands = [1, 3].map(ch => () => post('/api/manual_attenuation', { channel: ch, level: 'a' }));
    }
    commands.push(() => get('/api/transfer_switch', { params: { channel: 2, on: +!bandTwoSwitchToggled } }));
    await resolveSyncronously(commands).then(([{ data: { status } }]) => {
      let state = { response: 'undefined' };
      if (status) {
        state = {
          response: `Band 2 ${+status.slice(-1) ? 'msfb' : 'main'}`,
          bandTwoSwitchToggled: !bandTwoSwitchToggled,
          transferSwitchToggled: channel === 2 ? !bandTwoSwitchToggled : transferSwitchToggled,
        };
      }
      that.setStateFocusCommandInput(state);
    });
  }

  async handleBandThreeCheckSwitchToggle() {
    const { channel, transferSwitchToggled, bandThreeSwitchToggled } = this.state;
    const that = this;
    let commands = [];
    if (bandThreeSwitchToggled) {
      commands = [1, 2, 4].map(ch => () => post('/api/automatic_attenuation', { channel: ch }));
    } else {
      commands = [1, 2, 4].map(ch => () => post('/api/manual_attenuation', { channel: ch, level: 'a' }));
    }
    commands.push(() => get('/api/transfer_switch', { params: { channel: 3, on: +!bandThreeSwitchToggled } }));
    await resolveSyncronously(commands).then(([{ data: { status } }]) => {
      let state = { response: 'undefined' };
      if (status) {
        state = {
          response: `Band 3 ${+status.slice(-1) ? 'msfb' : 'main'}`,
          bandThreeSwitchToggled: !bandThreeSwitchToggled,
          transferSwitchToggled: channel === 3 ? !bandThreeSwitchToggled : transferSwitchToggled,
        };
      }
      that.setStateFocusCommandInput(state);
    });
  }

  async handleBandThreeCheckRadioChange({ target: { value } }) {
    const { bandThreeCheckRadioState } = this.state;
    if (value === bandThreeCheckRadioState) return;
    const {
      data: { status },
    } = await get('/api/msfb_switch/filter', { params: { filter: value } });
    const that = this;
    await get('/api/msfb_switch/indicator').then(({ data: { indicator } }) => {
      const state = { response: `${status} ${indicator}` };
      if (indicator) state.bandThreeCheckRadioState = value;
      that.setStateFocusCommandInput(state);
    });
  }

  displayBlankingCodes(codes, temperature) {
    this.setStateFocusCommandInput({
      response: `#T = ${temperature}°C#${parseBlankingCodesForDisplay(codes)}`,
    });
  }

  async handleAutomaticBlankingCodesClick() {
    const { unit, channel } = this.state;
    try {
      const {
        data: { codes, temperature },
      } = await axios.get('/api/blanking/automatic_algorithm', { params: { unit, channel } });
      this.displayBlankingCodes(codes, temperature);
    } catch (e) {
      this.setStateFocusCommandInput({ response: e.response.data.error.substring(7) });
    }
  }

  async handleAutomaticOIP3Click() {
    const { unit, channel } = this.state;
    /* eslint-disable no-alert */
    if (
      !(await _confirm(
        `Is the ${
          +channel === 1 ? 'Mini-Circuits ZAPD-30-S+' : 'Fairview Microwave MP0218-2'
        } combiner connected to RF IN on the box and are the two signal generators connected to the combiner?`
      ))
    )
      return;
    /* eslint-enable no-alert */
    const {
      data: { oip3, temperature },
    } = await axios.get('/api/oip3', { params: { unit, channel } });
    this.setStateFocusCommandInput({ response: `OIP3=${oip3} | T=${temperature}°C` });
  }

  render() {
    const {
      channel,
      unit,
      customCommand,
      response,
      transferSwitchToggled,
      filterBankState,
      adjacentAttenuationState,
      attValue,
      blankingSwitchToggled,
      blankingValue,
      bandTwoSwitchToggled,
      bandThreeSwitchToggled,
      bandThreeCheckRadioState,
      printCodes,
      printOIP3,
      printDate,
      printing,
    } = this.state;

    //* printing view
    if (printing) {
      return (
        <Fragment>
          <PrintTitle>{printOIP3.length ? 'OIP3 Values' : 'Blanking Codes'}</PrintTitle>
          <PrintUnit style={{ marginLeft: printOIP3.length ? '355px' : '345px' }}>Unit # {unit}</PrintUnit>
          <PrintDate>{printDate}</PrintDate>
          <br />
          {printOIP3.length ? (
            <PrintOIP3 oip3Array={printOIP3} />
          ) : (
            <PrintTable codesArray={printCodes} parseBlankingCodesForDisplay={parseBlankingCodesForDisplay} />
          )}
        </Fragment>
      );
    }

    //* normal view
    return (
      <Fragment>
        <Header
          channel={channel}
          unit={unit}
          customCommand={customCommand}
          response={response}
          handleUnitNumberChange={this.handleUnitNumberChange}
          connect={this.connect}
          handleCheckCommunication={this.handleCheckCommunication}
          handleCustomCommandSubmit={this.handleCustomCommandSubmit}
          handleCustomCommandChange={this.handleCustomCommandChange}
          handleTemperatureClick={this.handleTemperatureClick}
          handleChannelSwitch={this.handleChannelSwitch}
        />
        <br />
        <Container>
          <WiringControlCheck
            transferSwitchToggled={transferSwitchToggled}
            handleTransferSwitchToggle={this.handleTransferSwitchToggle}
            filterBankState={filterBankState}
            handleFilterBankIndClick={this.handleFilterBankIndClick}
            handleAdjacentAttenuationToggle={this.handleAdjacentAttenuationToggle}
            adjacentAttenuationState={adjacentAttenuationState}
            handleFilterBankStateSwitch={this.handleFilterBankStateSwitch}
            handleAutoAttClick={this.handleAutoAttClick}
            attValue={attValue}
            handleAttChange={this.handleAttChange}
            blankingSwitchToggled={blankingSwitchToggled}
            handleBlankingSwitchToggle={this.handleBlankingSwitchToggle}
            handleBlankingReadClick={this.handleBlankingReadClick}
            handleBlankingWriteClick={this.handleBlankingWriteClick}
            blankingValue={blankingValue}
            handleBlankingChange={this.handleBlankingChange}
          />
          <BlankingCodesCheck
            handleAutomaticBlankingCodesClick={this.handleAutomaticBlankingCodesClick}
            getBlankingCodes={this.getBlankingCodes}
            togglePrint={this.togglePrint}
          />
          <MSFBControlCheck
            bandTwoSwitchToggled={bandTwoSwitchToggled}
            handleBandTwoCheckSwitchToggle={this.handleBandTwoCheckSwitchToggle}
            bandThreeSwitchToggled={bandThreeSwitchToggled}
            handleBandThreeCheckSwitchToggle={this.handleBandThreeCheckSwitchToggle}
            bandThreeCheckRadioState={bandThreeCheckRadioState}
            handleBandThreeCheckRadioChange={this.handleBandThreeCheckRadioChange}
          />
          <OIP3Check
            handleAutomaticOIP3Click={this.handleAutomaticOIP3Click}
            getOIP3History={this.getOIP3History}
            togglePrint={this.togglePrint}
          />
        </Container>
      </Fragment>
    );
  }
}
