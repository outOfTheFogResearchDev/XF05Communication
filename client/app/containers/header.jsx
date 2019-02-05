import React, { Fragment } from 'react';
import styled from 'styled-components';
import BlankingCodeTable from './components/blankingCodeTable';

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
  border: 2px solid black;
  text-align: center;
`;

const Response = styled.span`
  font-size: 300%;
`;

/* eslint-disable react/prop-types */
export default ({
  channel,
  unit,
  customCommand,
  response,
  handleUnitNumberChange,
  connect,
  handleCheckCommunication,
  handleCustomCommandSubmit,
  handleCustomCommandChange,
  handleTemperatureClick,
  handleChannelSwitch,
}) => (
  <Fragment>
    <UnitForm onSubmit={e => e.preventDefault()}>
      <UnitNumberLabel>Unit #:</UnitNumberLabel>
      <UnitNumber type="number" min="0" value={unit} onChange={handleUnitNumberChange} />
    </UnitForm>
    <ProgramTitle>XF05 Communication</ProgramTitle>
    <Reconnect type="submit" onClick={connect}>
      Connect
    </Reconnect>
    <CheckConnection type="submit" onClick={handleCheckCommunication}>
      Check Communication
    </CheckConnection>
    <CustomCommandSubmit type="submit" onClick={handleCustomCommandSubmit}>
      Send
    </CustomCommandSubmit>
    <CustomCommand
      id="command-input"
      value={customCommand}
      onChange={handleCustomCommandChange}
      onKeyPress={({ charCode }) => {
        if (charCode === 13) handleCustomCommandSubmit();
      }}
    />
    <Temperature type="submit" onClick={handleTemperatureClick}>
      Temperature
    </Temperature>
    <br />
    {[1, 2, 3, 4, 5].map(num => (
      <Fragment key={num}>
        <ChannelText>Channel {num}</ChannelText>
        <ChannelRadio type="radio" checked={channel === num} onChange={handleChannelSwitch} value={num} />
      </Fragment>
    ))}
    <ResponseContainer>
      <Response>{response.charAt(0) === '#' ? <BlankingCodeTable response={response} /> : response}</Response>
    </ResponseContainer>
  </Fragment>
);
