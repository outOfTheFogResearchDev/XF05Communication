import React from 'react';
import styled from 'styled-components';
import ToggleSwitch from './subcomponents/toggleSwitch';

const Container = styled.div`
  grid-area: band-three-check;
  display: grid;
  grid:
    'header off switch on'
    'three four both neither';
  border-color: '#000';
  border-style: double;
  width: 250px;
  height: 120px;
  justify-self: center;
  align-self: center;
`;

const Label = styled.p`
  grid-area: header;
  margin-top: 0px;
  margin-left: 5px;
  font-size: 150%;
  justify-self: center;
`;

const ThreeContainer = styled.div`
  display: inline-block;
  justify-self: center;
  grid-area: three;
`;

const FourContainer = styled.div`
  display: inline-block;
  justify-self: center;
  grid-area: four;
`;

const BothContainer = styled.div`
  display: inline-block;
  justify-self: center;
  grid-area: both;
`;

const NeitherContainer = styled.div`
  display: inline-block;
  justify-self: center;
  grid-area: neither;
`;

const Text = styled.label``;

const Radio = styled.input`
  margin-left: 5px;
  transform: scale(1.25);
`;

const SwitchLabelOff = styled.p`
  grid-area: off;
  justify-self: end;
  align-self: center;
  font-size: 75%;
  margin-right: 2px;
`;

const SwitchLabelOn = styled.p`
  grid-area: on;
  align-self: center;
  font-size: 75%;
`;

/* eslint-disable react/prop-types */
export default ({
  bandThreeSwitchToggled,
  handleBandThreeCheckSwitchToggle,
  bandThreeCheckRadioState,
  handleBandThreeCheckRadioChange,
}) => (
  <Container>
    <Label>Band 3 Check</Label>
    <SwitchLabelOff>off</SwitchLabelOff>
    <ToggleSwitch toggled={bandThreeSwitchToggled} onToggle={handleBandThreeCheckSwitchToggle} />
    <SwitchLabelOn>on</SwitchLabelOn>
    <ThreeContainer>
      <Text>3</Text>
      <Radio
        type="radio"
        checked={bandThreeCheckRadioState === '3'}
        onChange={handleBandThreeCheckRadioChange}
        value="3"
      />
    </ThreeContainer>
    <FourContainer>
      <Text>4</Text>
      <Radio
        type="radio"
        checked={bandThreeCheckRadioState === '4'}
        onChange={handleBandThreeCheckRadioChange}
        value="4"
      />
    </FourContainer>
    <BothContainer>
      <Text>Both</Text>
      <Radio
        type="radio"
        checked={bandThreeCheckRadioState === 'both'}
        onChange={handleBandThreeCheckRadioChange}
        value="both"
      />
    </BothContainer>
    <NeitherContainer>
      <Text>Pass</Text>
      <Radio
        type="radio"
        checked={bandThreeCheckRadioState === 'neither'}
        onChange={handleBandThreeCheckRadioChange}
        value="neither"
      />
    </NeitherContainer>
  </Container>
);
