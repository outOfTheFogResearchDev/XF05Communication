import React from 'react';
import styled from 'styled-components';
import PrintTableCell from './components/printTableCell';

const PrintBody = styled.table`
  font-size: 125%;
  margin: 150px 65px 0px;
  transform: scale(1.15);
`;

const CableLossText = styled.td`
  text-align: center;
  font-size: 55%;
`;

const StateTable = styled.table`
  line-height: 68px;
`;

/* eslint-disable react/prop-types */
export default ({ codesArray, parseBlankingCodesForDisplay }) => (
  <PrintBody>
    <tbody>
      <tr>
        <th> </th> {/* eslint-disable-line react/self-closing-comp */}
        <th>Channel 1</th>
        <th>Channel 2</th>
        <th>Channel 3</th>
        <th>Channel 4</th>
        <th>Channel 5</th>
      </tr>
      <tr>
        <td>State</td>
        <CableLossText>(with Cable Loss: 0.6 dB)</CableLossText>
        <CableLossText>(with Cable Loss: 0.8 dB)</CableLossText>
        <CableLossText>(with Cable Loss: 1.1 dB)</CableLossText>
        <CableLossText>(with Cable Loss: 1.8 dB)</CableLossText>
        <CableLossText>(with Cable Loss: 2.8 dB)</CableLossText>
      </tr>
      <tr>
        <td rowSpan="4">
          <StateTable>
            <tbody>
              <tr>
                <td>0</td>
              </tr>
              <tr>
                <td>1</td>
              </tr>
              <tr>
                <td>2</td>
              </tr>
              <tr>
                <td>3</td>
              </tr>
            </tbody>
          </StateTable>
        </td>
        {codesArray.map(({ codes, temperature }) => (
          <td rowSpan="4" key={`${Math.random()}`}>
            <PrintTableCell response={{ codes: parseBlankingCodesForDisplay(codes), temperature }} />
          </td>
        ))}
      </tr>
    </tbody>
  </PrintBody>
);
