import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  gird-area: body;
  display: grid;
  grid: 'automatic history' /* print */;
  border-color: '#000';
  border-style: double;
  width: 300px;
  height: 60px;
  justify-self: center;
  align-self: center;
`;

const AutomaticOIP3 = styled.button`
  grid-area: automatic;
  padding: 5px 5px;
  justify-self: center;
  width: 80px;
  align-self: center;
`;

const OIP3Histoy = styled.button`
  grid-area: history;
  padding: 5px 5px;
  justify-self: center;
  width: 100px;
  align-self: center;
`;

// const Print = styled.button`
//   grid-area: print;
//   padding: 5px 5px;
//   justify-self: center;
//   width: 60px;
//   align-self: center;
// `;

/* eslint-disable react/prop-types */
export default ({ handleAutomaticOIP3Click, getOIP3History }) => (
  <Container>
    <AutomaticOIP3 type="submit" onClick={handleAutomaticOIP3Click}>
      Run OIP3
    </AutomaticOIP3>
    <OIP3Histoy type="submit" onClick={getOIP3History}>
      View Previous Data
    </OIP3Histoy>
    {/* <Print type="submit" onClick={togglePrint}>
      Print All
    </Print> */}
  </Container>
);
