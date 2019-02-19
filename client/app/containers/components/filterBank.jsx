import React from 'react';
import styled from 'styled-components';
import ToggleSwitch from './subcomponents/toggleSwitch';

const Container = styled.div`
  gird-area: filter-bank;
  display: grid;
  grid:
    'header toggleTitle toggleTitle toggleTitle'
    'ind off switch on'
    'low high msfb .';
  border-color: '#000';
  border-style: double;
  width: 285px;
  height: 110px;
  justify-self: center;
  align-self: center;
`;

const Label = styled.p`
  margin-top: 0px;
  font-size: 150%;
  grid-area: header;
  justify-self: center;
`;

const ToggleTitle = styled.p`
  grid-area: toggleTitle;
  justify-self: end;
  font-size: 85%;
  margin-top: 15px;
  margin-right: 17px;
`;

const Indicator = styled.button`
  grid-area: ind;
  justify-self: center;
  padding: 5px 5px;
  width: 107px;
  align-self: center;
  margin-top: -30px;
  margin-left: 10px;
`;

const SwitchLabelOff = styled.p`
  grid-area: off;
  justify-self: end;
  align-self: center;
  font-size: 75%;
  margin-top: -25px;
`;

const SwitchLabelOn = styled.p`
  grid-area: on;
  align-self: center;
  font-size: 75%;
  margin-top: -25px;
`;

const LowContainer = styled.div`
  display: inline-block;
  justify-self: center;
  grid-area: low;
`;

const HighContainer = styled.div`
  display: inline-block;
  justify-self: start;
  grid-area: high;
`;

const MSFBContainer = styled.div`
  display: inline-block;
  justify-self: center;
  grid-area: msfb;
`;

const Text = styled.label`
  display: inline-block;
`;

const Radio = styled.input`
  display: inline-block;
  margin-left: 5px;
  transform: scale(1.25);
`;

/* eslint-disable react/prop-types */
export default ({
  filterBankState,
  adjacentAttenuationState,
  handleAdjacentAttenuationToggle,
  handleFilterBankIndClick,
  handleFilterBankStateSwitch,
}) => (
  <Container>
    <Label>Filter Bank</Label>
    <ToggleTitle>Filter Data Mode</ToggleTitle>
    <Indicator type="submit" onClick={handleFilterBankIndClick}>
      Indicator Check
    </Indicator>
    <SwitchLabelOff>off</SwitchLabelOff>
    <ToggleSwitch marginTop="-30px" toggled={adjacentAttenuationState} onToggle={handleAdjacentAttenuationToggle} />
    <SwitchLabelOn>on</SwitchLabelOn>
    <LowContainer>
      <Text>Low</Text>
      <Radio type="radio" checked={filterBankState === 'low'} onChange={handleFilterBankStateSwitch} value="low" />
    </LowContainer>
    <HighContainer>
      <Text>High</Text>
      <Radio type="radio" checked={filterBankState === 'high'} onChange={handleFilterBankStateSwitch} value="high" />
    </HighContainer>
    <MSFBContainer>
      <Text>MSFB</Text>
      <Radio type="radio" checked={filterBankState === 'msfb'} onChange={handleFilterBankStateSwitch} value="msfb" />
    </MSFBContainer>
  </Container>
);
