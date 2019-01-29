import React, { Fragment } from 'react';
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

const BlankingCodeTable = styled.table`
  border: 1px solid grey;
  border-collapse: collapse;
  margin: 10px 10px;
  width: 95%;
`;

const BlankingCodeTableHeaders = styled.th`
  font-size: 50%;
  border: 1px solid grey;
`;

const State = styled.td`
  border: 1px solid grey;
`;

const Target = styled.td`
  border: 1px solid grey;
`;

const Actual = styled.td`
  border: 1px solid grey;
`;

const Code = styled.td`
  border: 1px solid grey;
`;

/* eslint-disable react/prop-types */
const ParseBlankingCodes = ({ response }) => {
  const [state, target, actual] = response.split('|');
  const [[actualL, codeL], [actualH, codeH]] = actual.split('/').map(value => value.split(':'));
  return (
    <Fragment>
      <tr>
        <State rowSpan="2">{state}</State>
        <Target rowSpan="2">{target}</Target>
        <Actual>{actualL}</Actual>
        <Code>{codeL}</Code>
      </tr>
      <tr>
        <Actual>{actualH}</Actual>
        <Code>{codeH}</Code>
      </tr>
    </Fragment>
  );
};

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
      onKeyPress={({ charCode }) => (charCode === 13 ? handleCustomCommandSubmit() : null)}
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
      <Response>
        {response.charAt(0) === '#' ? (
          <BlankingCodeTable>
            <tr>
              <BlankingCodeTableHeaders>State</BlankingCodeTableHeaders>
              <BlankingCodeTableHeaders>Target</BlankingCodeTableHeaders>
              <BlankingCodeTableHeaders>Actual</BlankingCodeTableHeaders>
              <BlankingCodeTableHeaders>Code</BlankingCodeTableHeaders>
            </tr>
            {response
              .substring(2)
              .split('_')
              .map(line => (
                <ParseBlankingCodes response={line} />
              ))}
          </BlankingCodeTable>
        ) : (
          response
        )}
      </Response>
    </ResponseContainer>
  </Fragment>
);
