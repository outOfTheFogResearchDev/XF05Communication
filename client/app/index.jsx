import React, { Fragment, Component } from 'react';
import { get, post } from 'axios';
import styled from 'styled-components';

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
  margin-left: 233px;
`;

const CustomCommandSubmit = styled.button`
  float: right;
  display: inline-block;
`;

const CustomCommand = styled.input`
  display: inline-block;
  float: right;
  margin-right: 15px;
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

const Temperature = styled.button`
  margin-left: 10px;
`;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unit: '',
      channel: '',
      customCommand: '',
      response: '',
    };

    this.handleUnitNumberChange = this.handleUnitNumberChange.bind(this);
    this.handleCustomCommandChange = this.handleCustomCommandChange.bind(this);
    this.handleCustomCommandSubmit = this.handleCustomCommandSubmit.bind(this);
    this.handleChannelSwitch = this.handleChannelSwitch.bind(this);
    this.handleTemperatureClick = this.handleTemperatureClick.bind(this);
  }

  setStateFocusCommandInput(state) {
    this.setState(state, () => document.getElementById('command-input').focus());
  }

  handleUnitNumberChange({ target: { value } }) {
    this.setState({ unit: +value });
  }

  handleCustomCommandChange({ target: { value: customCommand } }) {
    this.setState({ customCommand });
  }

  async handleCustomCommandSubmit() {
    const { customCommand: command } = this.state;
    if (command.length !== 5) return;
    const {
      data: { response },
    } = await get('/api', { params: { command } });
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

  render() {
    const { channel, unit, customCommand, response } = this.state;

    return (
      <Fragment>
        <UnitForm onSubmit={e => e.preventDefault()}>
          <UnitNumberLabel>Unit #:</UnitNumberLabel>
          <UnitNumber type="number" min="0" value={unit} onChange={this.handleUnitNumberChange} />
        </UnitForm>
        <ProgramTitle>XF05 Communication</ProgramTitle>
        <CustomCommandSubmit type="submit" onClick={this.handleCustomCommandSubmit}>
          Send
        </CustomCommandSubmit>
        <CustomCommand
          id="command-input"
          value={customCommand}
          onChange={this.handleCustomCommandChange}
          onKeyPress={({ charCode }) => (charCode === 13 ? this.handleCustomCommandSubmit() : null)}
        />
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
        <Temperature type="submit" onClick={this.handleTemperatureClick}>
          Temperature
        </Temperature>
      </Fragment>
    );
  }
}
