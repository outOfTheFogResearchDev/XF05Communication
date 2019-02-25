import React from 'react';
import styled from 'styled-components';
import BandTwoCheck from './components/bandTwoCheck';
import BandThreeCheck from './components/bandThreeCheck';

const Container = styled.div`
  grid-area: msfb;
  display: grid;
  grid:
    'title title'
    'band-two-check band-three-check';
  width: 450px;
  padding: 10px 10px;
  border-style: solid;
  border-color: #ddd;
  justify-self:center;
  align-self:center:
`;

const Title = styled.h2`
  grid-area: title;
  justify-self: center;
  margin-top: -5px;
  margin-bottom: 10px;
`;

/* eslint-disable react/prop-types */
export default props => (
  <Container>
    <Title>MSFB Wiring / Control Check</Title>
    <BandTwoCheck {...props} />
    <BandThreeCheck {...props} />
  </Container>
);
