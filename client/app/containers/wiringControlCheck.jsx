import React from 'react';
import styled from 'styled-components';
import TransferSwitch from './components/transferSwitch';
import FilterBank from './components/filterBank';
import Attenuation from './components/attenuation';
import Blanking from './components/blanking';

const Container = styled.div`
  grid-area: wiring;
  display: grid;
  grid:
    'title title'
    'transfer-switch filter-bank'
    'attenuation blanking';
  margin: 15px 5px;
  width: 475px;
  padding: 10px 10px;
  border-style: solid;
  border-color: #ddd;
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
    <Title>Wiring / Control Check</Title>
    <TransferSwitch {...props} />
    <FilterBank {...props} />
    <Attenuation {...props} />
    <Blanking {...props} />
  </Container>
);
