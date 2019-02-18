import React from 'react';
import styled from 'styled-components';

const ToggleSwitchWrapper = styled.div`
  gird-area: switch;
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-self: center;
  margin-top: ${props => props.marginTop || '0px'};
`;

const Toggle = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  transform: translate3d(0, 0, 0);
  background-color: ${props => props.bgClear};
  height: ${props => props.width / 2}px;
  width: ${props => props.width}px;
  border-radius: ${props => props.width / 4}px;
  padding: ${props => props.padding}px;
  border: 1px solid ${props => (props.toggled ? props.bgToggled : props.borderColor)};
`;

const ToggleBall = styled.div`
  z-index: 2;
  border-radius: 50%;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s cubic-bezier(1, 0.19, 0.15, 0.7);
  transition-delay: 0.1s;
  will-change: transform;
  background-color: ${props => props.ballColor};
  border: 1px solid ${props => props.borderColor};
  height: ${props => props.width / 2 - props.padding * 2}px;
  width: ${props => props.width / 2 - props.padding * 2}px;
  transform: ${props => (props.toggled ? `translateX(${props.width - props.width / 2}px)` : 'translateX(0px)')};
  &:active {
    background-color: ${props => props.ballColorActive};
  }
`;

const RippleBg = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: radial-gradient(circle, ${props => props.bgToggled} 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  pointer-events: none;
  transition: transform 0.5s, opacity 0.3s ease;
  transform: ${props => (props.visible ? 'scale(10, 10)' : 'scale(0, 0)')};
  opacity: ${props => (props.visible ? 1 : 0)};
  position: absolute;
  z-index: 1;
`;

const ToggleSwitch = props => {
  const { toggled, onToggle, marginTop } = props; // eslint-disable-line react/prop-types
  return (
    <ToggleSwitchWrapper marginTop={marginTop}>
      <Toggle onClick={onToggle} toggled={toggled} {...props}>
        <ToggleBall toggled={toggled} {...props} />
        <RippleBg visible={toggled} {...props} />
      </Toggle>
    </ToggleSwitchWrapper>
  );
};

ToggleSwitch.defaultProps = {
  width: 80,
  padding: 3,
  ballColor: '#ddd',
  ballColorActive: '#222',
  bgToggled: '#6f2da8',
  bgClear: '#0e4c92',
  borderColor: '#fff',
};

export default ToggleSwitch;
