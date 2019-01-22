import React from 'react';
import styled from 'styled-components';
import BandTwoCheck from './components/bandTwoCheck';
import BandThreeCheck from './components/bandThreeCheck';

const Container = styled.div`
  display: grid;
  grid:
    'title title'
    'band-two-check band-three-check';
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
export default ({
  bandTwoSwitchToggled,
  handleBandTwoCheckSwitchToggle,
  handleBandTwoCheckAttOnClick,
  handleBandTwoCheckAttOffClick,
  bandThreeSwitchToggled,
  handleBandThreeCheckSwitchToggle,
  bandThreeCheckRadioState,
  handleBandThreeCheckRadioChange,
}) => (
  <Container>
    <Title>MSFB Wiring / Control Check</Title>
    <BandTwoCheck
      bandTwoSwitchToggled={bandTwoSwitchToggled}
      handleBandTwoCheckSwitchToggle={handleBandTwoCheckSwitchToggle}
      handleBandTwoCheckAttOnClick={handleBandTwoCheckAttOnClick}
      handleBandTwoCheckAttOffClick={handleBandTwoCheckAttOffClick}
    />
    <BandThreeCheck
      bandThreeSwitchToggled={bandThreeSwitchToggled}
      handleBandThreeCheckSwitchToggle={handleBandThreeCheckSwitchToggle}
      bandThreeCheckRadioState={bandThreeCheckRadioState}
      handleBandThreeCheckRadioChange={handleBandThreeCheckRadioChange}
    />
  </Container>
);
