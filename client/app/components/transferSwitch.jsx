import React from 'react';
import styled from 'styled-components';
import ToggleSwitch from './subcomponents/toggleSwitch';

const Container = styled.div`
  grid-area: transfer-switch;
  display: grid;
  grid:
    'header'
    'switch';
  border-color: '#000';
  border-style: double;
  width: 170px;
  height: 110px;
  justify-self: center;
  align-self: center;
`;

const Label = styled.p`
  grid-area: header;
  margin-top: 0px;
  font-size: 150%;
  justify-self: center;
`;

/* eslint-disable react/prop-types */
export default ({ transferSwitchToggled, handleTransferSwitchToggle }) => (
  <Container>
    <Label>Transfer Switch</Label>
    <ToggleSwitch toggled={transferSwitchToggled} onToggle={handleTransferSwitchToggle} />
  </Container>
);
