import React from 'react';
import styled from 'styled-components';
import ToggleSwitch from './subcomponents/toggleSwitch';

const Container = styled.div`
  gird-area: blanking;
  display: grid;
  grid:
    'header switch'
    'read write'
    'level level';
  border-color: '#000';
  border-style: double;
  width: 200px;
  height: 135px;
  justify-self: center;
  align-self: center;
`;

const Label = styled.p`
  margin-top: 0px;
  font-size: 150%;
  grid-area: header;
  justify-self: center;
`;

const Read = styled.button`
  grid-area: read;
  justify-self: center;
  padding: 5px 5px;
  height: 70%;
  align-self: center;
`;
const Write = styled.button`
  grid-area: write;
  justify-self: center;
  padding: 5px 5px;
  height: 70%;
  align-self: center;
`;

const BlankingForm = styled.form`
  grid-area: level;
  justify-self: center;
`;

const BlankingNumberLabel = styled.label`
  display: inline-block;
  font-size: 125%;
`;

const BlankingNumber = styled.input`
  display: inline-block;
  width: 18px;
  margin-left: 10px;
  transform: scale(1.45);
`;

/* eslint-disable react/prop-types */
export default ({
  blankingSwitchToggled,
  handleBlankingSwitchToggle,
  handleBlankingReadClick,
  handleBlankingWriteClick,
  blankingValue,
  handleBlankingChange,
}) => (
  <Container>
    <Label>Blanking</Label>
    <ToggleSwitch toggled={blankingSwitchToggled} onToggle={handleBlankingSwitchToggle} />
    <Read type="submit" onClick={handleBlankingReadClick}>
      Read Code
    </Read>
    <Write type="submit" onClick={handleBlankingWriteClick}>
      Write Code
    </Write>
    <BlankingForm onSubmit={e => e.preventDefault()}>
      <BlankingNumberLabel>Blanking Code:</BlankingNumberLabel>
      <BlankingNumber type="text" value={blankingValue} onChange={handleBlankingChange} />
    </BlankingForm>
  </Container>
);
