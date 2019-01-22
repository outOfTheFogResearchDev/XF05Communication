import React from 'react';
import styled from 'styled-components';
import ToggleSwitch from './subcomponents/toggleSwitch';

const Container = styled.div`
  grid-area: band-two-check;
  display: grid;
  grid:
    'header off switch on'
    'attenuation-on attenuation-on attenuation-off attenuation-off';
  border-color: '#000';
  border-style: double;
  width: 200px;
  height: 120px;
  justify-self: center;
  align-self: center;
`;

const Label = styled.p`
  grid-area: header;
  margin-top: 0px;
  margin-left: 5px;
  font-size: 150%;
  justify-self: center;
`;

const SwitchLabelOff = styled.p`
  grid-area: off;
  justify-self: end;
  align-self: center;
  font-size: 75%;
  margin-right: 3px;
`;

const SwitchLabelOn = styled.p`
  grid-area: on;
  align-self: center;
  font-size: 75%;
  margin-right: 5px;
`;

const AttenuationOn = styled.button`
  grid-area: attenuation-on;
  justify-self: center;
  padding: 5px 5px;
  align-self: start;
`;

const AttenuationOff = styled.button`
  grid-area: attenuation-off;
  justify-self: center;
  padding: 5px 5px;
  align-self: start;
`;

/* eslint-disable react/prop-types */
export default ({
  bandTwoSwitchToggled,
  handleBandTwoCheckSwitchToggle,
  handleBandTwoCheckAttOnClick,
  handleBandTwoCheckAttOffClick,
}) => (
  <Container>
    <Label>Band 2 Check</Label>
    <SwitchLabelOff>off</SwitchLabelOff>
    <ToggleSwitch toggled={bandTwoSwitchToggled} onToggle={handleBandTwoCheckSwitchToggle} />
    <SwitchLabelOn>on</SwitchLabelOn>
    <AttenuationOn type="submit" onClick={handleBandTwoCheckAttOnClick}>
      Att On
    </AttenuationOn>
    <AttenuationOff type="submit" onClick={handleBandTwoCheckAttOffClick}>
      Att Off
    </AttenuationOff>
  </Container>
);
