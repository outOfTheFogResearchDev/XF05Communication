import React from 'react';
import styled from 'styled-components';
import ToggleSwitch from './subcomponents/toggleSwitch';

const Container = styled.div`
  grid-area: band-three-check;
  display: grid;
  grid:
    'header off switch on'
    'three four neither both';
  border-color: '#000';
  border-style: double;
  width: 260px;
  height: 88px;
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
  margin-top: -23px;
`;

const FourContainer = styled.div`
  display: inline-block;
  justify-self: center;
  grid-area: four;
  margin-top: -23px;
`;

const NeitherContainer = styled.div`
  display: inline-block;
  justify-self: center;
  grid-area: neither;
  margin-top: -23px;
`;

const BothContainer = styled.div`
  display: inline-block;
  justify-self: center;
  grid-area: both;
  margin-top: -23px;
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
  margin-top: -15px;
  margin-right: 2px;
`;

const SwitchLabelOn = styled.p`
  grid-area: on;
  align-self: center;
  font-size: 75%;
  margin-top: -15px;
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
    <ToggleSwitch toggled={bandThreeSwitchToggled} onToggle={handleBandThreeCheckSwitchToggle} marginTop="-25px" />
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
    <NeitherContainer>
      <Text>Pass</Text>
      <Radio
        type="radio"
        checked={bandThreeCheckRadioState === 'neither'}
        onChange={handleBandThreeCheckRadioChange}
        value="neither"
      />
    </NeitherContainer>
    <BothContainer>
      <Text>Both</Text>
      <Radio
        type="radio"
        checked={bandThreeCheckRadioState === 'both'}
        onChange={handleBandThreeCheckRadioChange}
        value="both"
      />
    </BothContainer>
  </Container>
);
