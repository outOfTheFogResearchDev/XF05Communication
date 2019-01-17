import React, { Fragment, Component } from 'react';
import { get, post } from 'axios';
import styled from 'styled-components';
import ToggleSwitch from './components/toggleSwitch';

const UnitForm = styled.form`
  display: inline-block;
`;

const UnitNumberLabel = styled.label`
  display: inline-block;
  font-size: 150%;
  margin-left: 5px;
`;

const UnitNumber = styled.input`
  display: inline-block;
  width: 35px;
  margin-left: 15px;
  margin-bottom: 10px;
  transform: scale(1.45);
`;

const ProgramTitle = styled.h1`
  display: inline-block;
  font-size: 150%;
  margin-left: 212px;
`;

const Reconnect = styled.button`
  display: inline-block;
  padding: 5px 5px;
  margin-left: 120px;
`;

const CheckConnection = styled.button`
  display: inline-block;
  padding: 5px 5px;
  margin-left: 13px;
`;

const CustomCommandSubmit = styled.button`
  float: right;
  padding: 13.5px 10px;
  margin-right: 10px;
  display: inline-block;
`;

const CustomCommand = styled.input`
  display: inline-block;
  float: right;
  margin-right: 15px;
  height: 40px;
  width: 100px;
  font-size: 150%;
`;

const Temperature = styled.button`
  display: inline-block;
  float: right;
  margin-right: 142px;
  padding: 13.5px 10px;
`;

const ChannelText = styled.label`
  display: inline-block;
  font-size: 150%;
  margin-left: 40px;
`;

const ChannelRadio = styled.input`
  display: inline-block;
  margin-right: 15px;
  margin-left: 10px;
  transform: scale(1.25);
`;

const ResponseContainer = styled.div`
  display: inline-block;
  float: right;
  margin-right: 10px;
  width: 411px;
  border: 2px solid grey;
  text-align: center;
`;

const Response = styled.span`
  font-size: 300%;
`;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unit: '',
      channel: '',
      customCommand: '',
      response: 'dddddddddddd ffffffffffffff',
      connected: false,
    };

    this.connect = this.connect.bind(this);
    this.handleUnitNumberChange = this.handleUnitNumberChange.bind(this);
    this.handleCheckCommunication = this.addConnectedCheck(this.handleCheckCommunication);
    this.handleTemperatureClick = this.addConnectedCheck(this.handleTemperatureClick);
    this.handleCustomCommandChange = this.handleCustomCommandChange.bind(this);
    this.handleCustomCommandSubmit = this.addConnectedCheck(this.handleCustomCommandSubmit);
    this.handleChannelSwitch = this.handleChannelSwitch.bind(this);
    this.handleTransferSwitchToggle = this.addUnitCheck(this.addConnectedCheck(this.handleTransferSwitchToggle));
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

  addUnitCheck(func) {
    return (...args) => {
      const { unit } = this.state;
      if (unit) func.apply(this, args);
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

  handleChannelSwitch({ target: { value } }) {
    const { unit } = this.state;
    if (unit) this.setStateFocusCommandInput({ channel: +value });
  }

  async handleTemperatureClick() {
    const {
      data: { temperature },
    } = await get('/api/temp');
    this.setStateFocusCommandInput({ response: `${temperature}°C` });
  }

  async handleTransferSwitchToggle() {
    const { channel, transferSwitchToggled } = this.state;
    const {
      data: { status: response },
    } = await get('/api/transfer_switch', { params: { channel, on: +!transferSwitchToggled } });
    this.setStateFocusCommandInput({ response, transferSwitchToggled: !transferSwitchToggled });
  }

  render() {
    const { channel, unit, customCommand, response, transferSwitchToggled } = this.state;

    return (
      <Fragment>
        <UnitForm onSubmit={e => e.preventDefault()}>
          <UnitNumberLabel>Unit #:</UnitNumberLabel>
          <UnitNumber type="number" min="0" value={unit} onChange={this.handleUnitNumberChange} />
        </UnitForm>
        <ProgramTitle>XF05 Communication</ProgramTitle>
        <Reconnect type="submit" onClick={this.connect}>
          Connect
        </Reconnect>
        <CheckConnection type="submit" onClick={this.handleCheckCommunication}>
          Check Communication
        </CheckConnection>
        <CustomCommandSubmit type="submit" onClick={this.handleCustomCommandSubmit}>
          Send
        </CustomCommandSubmit>
        <CustomCommand
          id="command-input"
          value={customCommand}
          onChange={this.handleCustomCommandChange}
          onKeyPress={({ charCode }) => (charCode === 13 ? this.handleCustomCommandSubmit() : null)}
        />
        <Temperature type="submit" onClick={this.handleTemperatureClick}>
          Temperature
        </Temperature>
        <br />
        {[1, 2, 3, 4, 5].map(num => (
          <Fragment key={num}>
            <ChannelText>Channel {num}</ChannelText>
            <ChannelRadio type="radio" checked={channel === num} onChange={this.handleChannelSwitch} value={num} />
          </Fragment>
        ))}
        <ResponseContainer>
          <Response>{response}</Response>
        </ResponseContainer>
        <br />
        <ToggleSwitch toggled={transferSwitchToggled} onToggle={this.handleTransferSwitchToggle} />
      </Fragment>
    );
  }
}
