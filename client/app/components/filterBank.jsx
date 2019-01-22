import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  gird-area: filter-bank;
  display: grid;
  grid:
    'header header header ind'
    'low . high break';
  border-color: '#000';
  border-style: double;
  width: 240px;
  height: 80px;
  justify-self: center;
  align-self: center;
`;

const Label = styled.p`
  margin-top: 0px;
  font-size: 150%;
  grid-area: header;
  justify-self: center;
`;

const Indicator = styled.button`
  grid-area: ind;
  justify-self: center;
  padding: 5px 5px;
  height: 50%;
  align-self: center;
`;

const LowContainer = styled.div`
  display: inline-block;
  justify-self: end;
  grid-area: low;
`;

const HighContainer = styled.div`
  display: inline-block;
  justify-self: end;
  grid-area: high;
`;

const BreakContainer = styled.div`
  display: inline-block;
  justify-self: center;
  grid-area: break;
`;

const Text = styled.label`
  display: inline-block;
`;

const Radio = styled.input`
  display: inline-block;
  margin-left: 5px;
  transform: scale(1.25);
`;

/* eslint-disable react/prop-types */
export default ({ filterBankState, handleFilterBankIndClick, handleFilterBankStateSwitch }) => (
  <Container>
    <Label>Filter Bank</Label>
    <Indicator type="submit" onClick={handleFilterBankIndClick}>
      Indicator Check
    </Indicator>
    <LowContainer>
      <Text>Low</Text>
      <Radio type="radio" checked={filterBankState === 'low'} onChange={handleFilterBankStateSwitch} value="low" />
    </LowContainer>
    <HighContainer>
      <Text>High</Text>
      <Radio type="radio" checked={filterBankState === 'high'} onChange={handleFilterBankStateSwitch} value="high" />
    </HighContainer>
    <BreakContainer>
      <Text>Break</Text>
      <Radio type="radio" checked={filterBankState === 'break'} onChange={handleFilterBankStateSwitch} value="break" />
    </BreakContainer>
  </Container>
);
