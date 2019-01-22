import React from 'react';
import styled from 'styled-components';
import TransferSwitch from './components/transferSwitch';
import FilterBank from './components/filterBank';
import Attenuation from './components/attenuation';
import Blanking from './components/blanking';

const Container = styled.div`
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
export default ({
  transferSwitchToggled,
  handleTransferSwitchToggle,
  filterBankState,
  handleFilterBankIndClick,
  handleFilterBankStateSwitch,
  handleAutoAttClick,
  attValue,
  handleAttChange,
  blankingSwitchToggled,
  handleBlankingSwitchToggle,
  handleBlankingReadClick,
  handleBlankingWriteClick,
  blankingValue,
  handleBlankingChange,
}) => (
  <Container>
    <Title>Wiring / Control Check</Title>
    <TransferSwitch
      transferSwitchToggled={transferSwitchToggled}
      handleTransferSwitchToggle={handleTransferSwitchToggle}
    />
    <FilterBank
      filterBankState={filterBankState}
      handleFilterBankIndClick={handleFilterBankIndClick}
      handleFilterBankStateSwitch={handleFilterBankStateSwitch}
    />
    <Attenuation handleAutoAttClick={handleAutoAttClick} attValue={attValue} handleAttChange={handleAttChange} />
    <Blanking
      blankingSwitchToggled={blankingSwitchToggled}
      handleBlankingSwitchToggle={handleBlankingSwitchToggle}
      handleBlankingReadClick={handleBlankingReadClick}
      handleBlankingWriteClick={handleBlankingWriteClick}
      blankingValue={blankingValue}
      handleBlankingChange={handleBlankingChange}
    />
  </Container>
);
