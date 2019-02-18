import React from 'react';
import styled from 'styled-components';
import BlankingCodesButtons from './components/blankingCodesButtons';

const Container = styled.div`
  grid-area: blanking;
  display: grid;
  grid:
    'title'
    'body';
  margin: 15px 10px 15px -40px;
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
    <Title>Blanking Codes Check</Title>
    <BlankingCodesButtons {...props} />
  </Container>
);
