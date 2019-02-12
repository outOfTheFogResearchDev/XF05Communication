import React from 'react';
import styled from 'styled-components';

const OIP3Table = styled.table`
  border: 1px solid grey;
  border-collapse: collapse;
  margin: 100px 305px;
  font-size: 200%;
  text-align: center;
`;

const Headers = styled.th`
  font-size: 75%;
  border: 1px solid grey;
  padding: 10px 10px;
`;

const Cell = styled.td`
  border: 1px solid grey;
  padding: 10px 10px;
`;

/* eslint-disable react/prop-types */
export default ({ oip3Array }) => (
  <OIP3Table>
    <tbody>
      <tr>
        <Headers>Channel</Headers>
        <Headers>OIP3 Value</Headers>
        <Headers>Target</Headers>
      </tr>
      {oip3Array.map(([channel, oip3]) => (
        <tr key={`${Math.random()}`}>
          <Cell>{channel}</Cell>
          <Cell>{+oip3 ? `${oip3}` : ''}</Cell>
          <Cell>{+channel === 1 ? '> 22' : '> 16'}</Cell>
        </tr>
      ))}
    </tbody>
  </OIP3Table>
);
