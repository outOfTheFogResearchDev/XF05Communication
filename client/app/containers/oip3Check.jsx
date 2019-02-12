import React from 'react';
import styled from 'styled-components';
import OIP3Buttons from './components/oip3Buttons';

const Container = styled.div`
  grid-area: oip3;
  display: grid;
  grid:
    'title'
    'body';
  margin: 15px 10px 15px -60px;
  padding: 10px 10px;
  height: 100px;
  border-style: solid;
  border-color: #ddd;
  justify-self: center;
  align-self: center;
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
    <Title>OIP3</Title>
    <OIP3Buttons {...props} />
  </Container>
);
