import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  gird-area: attenuation;
  display: grid;
  grid:
    'header auto'
    'level level';
  border-color: '#000';
  border-style: double;
  width: 220px;
  height: 95px;
  justify-self: center;
  align-self: center;
`;

const Label = styled.p`
  margin-top: 0px;
  font-size: 150%;
  grid-area: header;
  justify-self: center;
`;

const Auto = styled.button`
  grid-area: auto;
  padding: 5px 5px;
  height: 48%;
  justify-self: center;
  align-self: center;
`;

const AttForm = styled.form`
  grid-area: level;
  justify-self: center;
`;

const AttNumberLabel = styled.label`
  display: inline-block;
  font-size: 125%;
`;

const AttNumber = styled.input`
  display: inline-block;
  width: 30px;
  margin-left: 10px;
  transform: scale(1.45);
`;

/* eslint-disable react/prop-types */
export default ({ handleAutoAttClick, attValue, handleAttChange }) => (
  <Container>
    <Label>Attenuation</Label>
    <Auto type="submit" onClick={handleAutoAttClick}>
      Set to Auto
    </Auto>
    <AttForm onSubmit={e => e.preventDefault()}>
      <AttNumberLabel>Attenuation Level:</AttNumberLabel>
      <AttNumber type="text" value={attValue} onChange={handleAttChange} />
    </AttForm>
  </Container>
);
