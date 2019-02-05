import React, { Fragment, Component } from 'react';
import { get, post } from 'axios';
import styled from 'styled-components';
import PrintTable from './containers/printTable';
import Header from './containers/header';
import WiringControlCheck from './containers/wiringControlCheck';
import BlankingCodesCheck from './containers/blankingCodesCheck';
import MSFBControlCheck from './containers/msfbControlCheck';

const PrintTitle = styled.h1`
  display: inline-block;
  font-size: 100%;
`;

const PrintUnit = styled.h1`
  display: inline-block;
  font-size: 100%;
  margin-left: 340px;
`;

const PrintDate = styled.h1`
  display: inline-block;
  font-size: 100%;
  float: right;
`;

const Container = styled.div`
  display: grid;
  grid:
    'wiring .'
    'msfb blanking';
`;

const resolveSyncronously = async pArray => {
  await pArray.pop()();
  if (pArray.length) await resolveSyncronously(pArray);
};

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
      attValue: 'Auto',
      blankingSwitchToggled: false,
      blankingValue: '',
      bandTwoSwitchToggled: false,
      bandThreeSwitchToggled: false,
      bandThreeCheckRadioState: '',
      printCodes: [],
      printing: false,
    };

    this.getBlankingCodes = this.getBlankingCodes.bind(this);
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
    this.handleAutoAttClick = this.addConnectedCheck(this.addChannelCheck(this.handleAutoAttClick));
    this.handleAttChange = this.addConnectedCheck(this.addChannelCheck(this.handleAttChange));
    this.handleBlankingSwitchToggle = this.addConnectedCheck(this.addChannelCheck(this.handleBlankingSwitchToggle));
    this.handleBlankingReadClick = this.addConnectedCheck(this.addChannelCheck(this.handleBlankingReadClick));
    this.handleBlankingWriteClick = this.addConnectedCheck(this.addChannelCheck(this.handleBlankingWriteClick));
    this.handleBlankingChange = this.handleBlankingChange.bind(this);
    this.handleBandTwoCheckSwitchToggle = this.addConnectedCheck(this.handleBandTwoCheckSwitchToggle);
    this.handleBandTwoCheckAttOnClick = this.addConnectedCheck(this.handleBandTwoCheckAttOnClick);
    this.handleBandTwoCheckAttOffClick = this.addConnectedCheck(this.handleBandTwoCheckAttOffClick);
    this.handleBandThreeCheckSwitchToggle = this.addConnectedCheck(this.handleBandThreeCheckSwitchToggle);
    this.handleBandThreeCheckRadioChange = this.addConnectedCheck(this.handleBandThreeCheckRadioChange);
    this.handleAutomaticBlankingCodesClick = this.addChannelCheck(this.handleAutomaticBlankingCodesClick);
  }

  async componentDidMount() {
    await this.connect();
  }

  componentDidUpdate() {
    const { printing } = this.state;
    if (printing) {
      this.print();
    }
  }

  setStateFocusCommandInput(state) {
    this.setState(state, () => document.getElementById('command-input').focus());
  }

  async getBlankingCodes() {
    const { unit, channel } = this.state;
    const {
      data: { codes, temperature },
    } = await get('/api/blanking/history', { params: { unit, channel } });
    this.displayBlankingCodes(codes, temperature);
  }

  print() {
    window.print();
    this.togglePrint();
  }

  async togglePrint() {
    const { printing, unit } = this.state;
    if (unit) {
      if (!printing) {
        const {
          data: { codes: printCodes },
        } = await get('/api/blanking/full_history', { params: { unit } });
        this.setState({ printing: true, printCodes });
      } else {
        this.setState({ printing: false, printCodes: [] });
      }
    }
  }

  async connect() {
    const { connected } = this.state;
    if (connected) this.setState({ response: 'Connected to XF05' });
    else {
      try {
        await post('/api/connect');
        this.setState({ connected: true, response: 'Connected to XF05' });
      } catch (e) {
        window.alert('Issue opening COM port to XF05, please connect the USB and click "connect"'); // eslint-disable-line no-alert
        this.setState({ connected: false });
      }
    }
  }

  addConnectedCheck(func) {
    return (...args) => {
      const { connected } = this.state;
      if (connected) func.apply(this, args);
      else window.alert('You are not connected to the COM port, please click "Connect"'); // eslint-disable-line no-alert
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
      attValue,
      blankingSwitchToggled,
      bandTwoSwitchToggled,
      bandThreeSwitchToggled,
      bandThreeCheckRadioState,
    } = this.state;
    if (!unit || channel === +value) return;
    const resets = [];
    if (transferSwitchToggled) resets.push(() => get('/api/transfer_switch', { params: { channel, on: 0 } }));
    if (filterBankState) resets.push(() => post('/api/filter_bank/mode', { channel, mode: 'break' }));
    if (attValue !== 'Auto') resets.push(() => post('/api/automatic_attenuation', { channel }));
    if (blankingSwitchToggled) resets.push(() => post('/api/blanking', { channel, on: 0 }));
    if (bandThreeCheckRadioState) resets.push(() => get('/api/msfb_switch/filter', { params: { filter: 0 } }));
    if (channel !== 2 && bandTwoSwitchToggled)
      resets.push(() => get('/api/transfer_switch', { params: { channel: 2, on: 0 } }));
    if (channel !== 3 && bandThreeSwitchToggled)
      resets.push(() => get('/api/transfer_switch', { params: { channel: 3, on: 0 } }));

    if (resets.length) await resolveSyncronously(resets);
    this.setStateFocusCommandInput({
      channel: +value,
      transferSwitchToggled: false,
      filterBankState: '',
      attValue: 'Auto',
      blankingSwitchToggled: false,
      blankingValue: '',
      bandTwoSwitchToggled: false,
      bandThreeSwitchToggled: false,
      bandThreeCheckRadioState: '',
    });
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
      ({ data: { status: response } }) =>
        that.setStateFocusCommandInput({
          response,
          transferSwitchToggled: !transferSwitchToggled,
          bandTwoSwitchToggled: channel === 2 ? !transferSwitchToggled : bandTwoSwitchToggled,
          bandThreeSwitchToggled: channel === 3 ? !transferSwitchToggled : bandThreeSwitchToggled,
        })
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

  async handleAutoAttClick() {
    const { channel } = this.state;
    try {
      await post('/api/automatic_attenuation', { channel });
      this.setStateFocusCommandInput({ response: 'Attenuation Set to Auto', attValue: 'Auto' });
    } catch (e) {
      this.setStateFocusCommandInput({ response: 'Failed' });
    }
  }

  async handleAttChange({ target: { value: level } }) {
    if (level === '') {
      this.setState({ attValue: level });
      return;
    }
    const { channel } = this.state;
    const levelInt = parseInt(level, 16);
    if (levelInt && levelInt >= 1 && levelInt <= 13) {
      try {
        await post('/api/manual_attenuation', { channel, level });
        this.setState({ response: `Attenuation Set: ${level}`, attValue: level });
      } catch (e) {
        this.setState({ response: 'Failed' });
      }
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
    await get('/api/transfer_switch', { params: { channel: 2, on: +!bandTwoSwitchToggled } }).then(
      ({ data: { status } }) =>
        that.setStateFocusCommandInput({
          response: `Band 2 ${+status.slice(-1) ? 'through' : 'pass'}`,
          bandTwoSwitchToggled: !bandTwoSwitchToggled,
          transferSwitchToggled: channel === 2 ? !bandTwoSwitchToggled : transferSwitchToggled,
        })
    );
  }

  async handleBandTwoCheckAttOnClick() {
    try {
      await post('/api/manual_attenuation', { channel: 1, level: 'A' });
      this.setStateFocusCommandInput({ response: `Band 1 Attenuation Set: A` });
    } catch (e) {
      this.setStateFocusCommandInput({ response: 'Failed' });
    }
  }

  async handleBandTwoCheckAttOffClick() {
    try {
      await post('/api/manual_attenuation', { channel: 1, level: '1' });
      this.setStateFocusCommandInput({ response: `Band 1 Attenuation Set: 1` });
    } catch (e) {
      this.setStateFocusCommandInput({ response: 'Failed' });
    }
  }

  async handleBandThreeCheckSwitchToggle() {
    const { channel, transferSwitchToggled, bandThreeSwitchToggled } = this.state;
    const that = this;
    await get('/api/transfer_switch', { params: { channel: 3, on: +!bandThreeSwitchToggled } }).then(
      ({ data: { status } }) =>
        that.setStateFocusCommandInput({
          response: `Band 3 ${+status.slice(-1) ? 'through' : 'pass'}`,
          bandThreeSwitchToggled: !bandThreeSwitchToggled,
          transferSwitchToggled: channel === 3 ? !bandThreeSwitchToggled : transferSwitchToggled,
        })
    );
  }

  async handleBandThreeCheckRadioChange({ target: { value } }) {
    const { bandThreeCheckRadioState } = this.state;
    if (value === bandThreeCheckRadioState) return;
    const {
      data: { status },
    } = await get('/api/msfb_switch/filter', { params: { filter: value } });
    const that = this;
    await get('/api/msfb_switch/indicator').then(({ data: { indicator } }) =>
      that.setStateFocusCommandInput({
        response: `${status} ${indicator}`,
        bandThreeCheckRadioState: value,
      })
    );
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
      } = await get('/api/blanking/automatic_algorithm', { params: { unit, channel } });
      this.displayBlankingCodes(codes, temperature);
    } catch (e) {
      this.setStateFocusCommandInput({ response: e.response.data.error.substring(7) });
    }
  }

  render() {
    const {
      channel,
      unit,
      customCommand,
      response,
      transferSwitchToggled,
      filterBankState,
      attValue,
      blankingSwitchToggled,
      blankingValue,
      bandTwoSwitchToggled,
      bandThreeSwitchToggled,
      bandThreeCheckRadioState,
      printCodes,
      printing,
    } = this.state;

    //* printing view
    if (printing) {
      const today = new Date();
      const date = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
      return (
        <Fragment>
          <PrintTitle>Blanking Codes</PrintTitle>
          <PrintUnit>Unit # {unit}</PrintUnit>
          <PrintDate>{date}</PrintDate>
          <br />
          <PrintTable codesArray={printCodes} parseBlankingCodesForDisplay={parseBlankingCodesForDisplay} />
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
          <MSFBControlCheck
            bandTwoSwitchToggled={bandTwoSwitchToggled}
            handleBandTwoCheckSwitchToggle={this.handleBandTwoCheckSwitchToggle}
            handleBandTwoCheckAttOnClick={this.handleBandTwoCheckAttOnClick}
            handleBandTwoCheckAttOffClick={this.handleBandTwoCheckAttOffClick}
            bandThreeSwitchToggled={bandThreeSwitchToggled}
            handleBandThreeCheckSwitchToggle={this.handleBandThreeCheckSwitchToggle}
            bandThreeCheckRadioState={bandThreeCheckRadioState}
            handleBandThreeCheckRadioChange={this.handleBandThreeCheckRadioChange}
          />
          <BlankingCodesCheck
            handleAutomaticBlankingCodesClick={this.handleAutomaticBlankingCodesClick}
            getBlankingCodes={this.getBlankingCodes}
            togglePrint={this.togglePrint}
          />
        </Container>
      </Fragment>
    );
  }
}
