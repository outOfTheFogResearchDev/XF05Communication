import React, { Fragment, Component } from 'react';
import { get, post } from 'axios';
import styled from 'styled-components';
import Header from './components/header';
import TransferSwitch from './components/transferSwitch';
import FilterBank from './components/filterBank';
import Attenuation from './components/attenuation';
import Blanking from './components/blanking';

const Container = styled.div`
  display: grid;
  grid:
    'transfer-switch filter-bank'
    'attenuation blanking';
  margin: 15px 5px;
  width: 500px;
  padding: 10px 10px;
  border-style: solid;
  border-color: #ddd;
`;

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
    };

    this.connect = this.connect.bind(this);
    this.handleUnitNumberChange = this.handleUnitNumberChange.bind(this);
    this.handleCheckCommunication = this.addConnectedCheck(this.handleCheckCommunication);
    this.handleTemperatureClick = this.addConnectedCheck(this.handleTemperatureClick);
    this.handleCustomCommandChange = this.handleCustomCommandChange.bind(this);
    this.handleCustomCommandSubmit = this.addConnectedCheck(this.handleCustomCommandSubmit);
    this.handleChannelSwitch = this.handleChannelSwitch.bind(this);
    this.handleTransferSwitchToggle = this.addChannelCheck(this.addConnectedCheck(this.handleTransferSwitchToggle));
    this.handleFilterBankStateSwitch = this.addChannelCheck(this.addConnectedCheck(this.handleFilterBankStateSwitch));
    this.handleFilterBankIndClick = this.addChannelCheck(this.addConnectedCheck(this.handleFilterBankIndClick));
    this.handleAutoAttClick = this.addChannelCheck(this.addConnectedCheck(this.handleAutoAttClick));
    this.handleAttChange = this.addChannelCheck(this.addConnectedCheck(this.handleAttChange));
    this.handleBlankingSwitchToggle = this.addChannelCheck(this.addConnectedCheck(this.handleBlankingSwitchToggle));
    this.handleBlankingReadClick = this.addChannelCheck(this.addConnectedCheck(this.handleBlankingReadClick));
    this.handleBlankingWriteClick = this.addChannelCheck(this.addConnectedCheck(this.handleBlankingWriteClick));
    this.handleBlankingChange = this.handleBlankingChange.bind(this);
  }

  async componentDidMount() {
    await this.connect();
  }

  setStateFocusCommandInput(state) {
    this.setState(state, () => document.getElementById('command-input').focus());
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
    const { unit, channel, transferSwitchToggled, filterBankState, attValue, blankingSwitchToggled } = this.state;
    if (!unit || channel === +value) return;
    const resets = [];
    if (transferSwitchToggled) resets.push(get('/api/transfer_switch', { params: { channel, on: 0 } }));
    if (filterBankState) resets.push(post('/api/filter_bank/mode', { channel, mode: 'break' }));
    if (attValue !== 'Auto') resets.push(post('/api/automatic_attenuation', { channel }));
    if (blankingSwitchToggled) resets.push(post('/api/blanking', { channel, on: 0 }));
    await Promise.all(resets);
    this.setStateFocusCommandInput({
      channel: +value,
      transferSwitchToggled: false,
      filterBankState: '',
      attValue: 'Auto',
      blankingSwitchToggled: false,
      blankingValue: '',
    });
  }

  async handleTemperatureClick() {
    const {
      data: { temperature },
    } = await get('/api/temp');
    this.setStateFocusCommandInput({ response: `${temperature}°C` });
  }

  async handleTransferSwitchToggle() {
    const { channel, transferSwitchToggled } = this.state;
    const that = this;
    await get('/api/transfer_switch', { params: { channel, on: +!transferSwitchToggled } }).then(
      ({ data: { status: response } }) =>
        that.setStateFocusCommandInput({ response, transferSwitchToggled: !transferSwitchToggled })
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
    this.setStateFocusCommandInput({ response: `Blanking Code: ${code}` });
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
    } = this.state;

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
          <TransferSwitch
            transferSwitchToggled={transferSwitchToggled}
            handleTransferSwitchToggle={this.handleTransferSwitchToggle}
          />
          <FilterBank
            filterBankState={filterBankState}
            handleFilterBankIndClick={this.handleFilterBankIndClick}
            handleFilterBankStateSwitch={this.handleFilterBankStateSwitch}
          />
          <Attenuation
            handleAutoAttClick={this.handleAutoAttClick}
            attValue={attValue}
            handleAttChange={this.handleAttChange}
          />
          <Blanking
            blankingSwitchToggled={blankingSwitchToggled}
            handleBlankingSwitchToggle={this.handleBlankingSwitchToggle}
            handleBlankingReadClick={this.handleBlankingReadClick}
            handleBlankingWriteClick={this.handleBlankingWriteClick}
            blankingValue={blankingValue}
            handleBlankingChange={this.handleBlankingChange}
          />
        </Container>
      </Fragment>
    );
  }
}
