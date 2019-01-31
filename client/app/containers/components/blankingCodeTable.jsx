import React from 'react';
import styled from 'styled-components';
import ParseBlankingCodes from './subcomponents/blankingCodeParser';

const BlankingCodeTable = styled.table`
  border: 1px solid grey;
  border-collapse: collapse;
  margin: 10px 10px;
  width: 95%;
`;

const BlankingCodeTableHeaders = styled.th`
  font-size: 50%;
  border: 1px solid grey;
`;

const BlankingCodeTableFooter = styled.td`
  font-size: 75%;
  border: 1px solid grey;
`;

/* eslint-disable react/prop-types */
export default ({ response }) => {
  const [, tempurature, codes] = response.split('#');
  return (
    <BlankingCodeTable>
      <tbody>
        <tr>
          <BlankingCodeTableHeaders>State</BlankingCodeTableHeaders>
          <BlankingCodeTableHeaders>Target</BlankingCodeTableHeaders>
          <BlankingCodeTableHeaders>Actual</BlankingCodeTableHeaders>
          <BlankingCodeTableHeaders>Code</BlankingCodeTableHeaders>
        </tr>
        {codes
          .substring(1)
          .split('_')
          .map(line => (
            <ParseBlankingCodes key={`${Math.random()}`} response={line} />
          ))}
        <tr>
          <BlankingCodeTableFooter colSpan="4">{tempurature}</BlankingCodeTableFooter>
        </tr>
      </tbody>
    </BlankingCodeTable>
  );
};
