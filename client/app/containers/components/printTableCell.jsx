import React from 'react';
import styled from 'styled-components';
import BlankingCodeParser from './subcomponents/blankingCodeParser';

const BlankingCodeTable = styled.table`
  border: 1px solid grey;
  border-collapse: collapse;
  margin: 10px 10px;
  width: 95%;
  text-align: center;
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
export default ({ response: { codes, temperature } }) => (
  <BlankingCodeTable>
    <tbody>
      <tr>
        <BlankingCodeTableHeaders>Target</BlankingCodeTableHeaders>
        <BlankingCodeTableHeaders>Actual</BlankingCodeTableHeaders>
        <BlankingCodeTableHeaders>Code</BlankingCodeTableHeaders>
      </tr>
      {codes
        .substring(1)
        .split('_')
        .map(line => (
          <BlankingCodeParser key={`${Math.random()}`} response={line} withOutState />
        ))}
      <tr>
        <BlankingCodeTableFooter colSpan="4">{`T = ${temperature}`}</BlankingCodeTableFooter>
      </tr>
    </tbody>
  </BlankingCodeTable>
);
