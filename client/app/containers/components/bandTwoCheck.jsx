import React from 'react';
import styled from 'styled-components';
import ToggleSwitch from './subcomponents/toggleSwitch';

const Container = styled.div`
  grid-area: band-two-check;
  display: grid;
  grid:
    'header header header'
    'off switch on';
  border-color: '#000';
  border-style: double;
  width: 155px;
  height: 85px;
  justify-self: center;
  align-self: center;
`;

const Label = styled.p`
  grid-area: header;
  margin-top: 0px;
  font-size: 150%;
  justify-self: center;
`;

const SwitchLabelOff = styled.p`
  grid-area: off;
  justify-self: end;
  align-self: center;
  font-size: 75%;
  margin-top: -20px;
`;

const SwitchLabelOn = styled.p`
  grid-area: on;
  align-self: center;
  font-size: 75%;
  margin-top: -20px;
`;

/* eslint-disable react/prop-types */
export default ({ bandTwoSwitchToggled, handleBandTwoCheckSwitchToggle }) => (
  <Container>
    <Label>Band 2 Check</Label>
    <SwitchLabelOff>off</SwitchLabelOff>
    <ToggleSwitch toggled={bandTwoSwitchToggled} onToggle={handleBandTwoCheckSwitchToggle} marginTop="-30px" />
    <SwitchLabelOn>on</SwitchLabelOn>
  </Container>
);
