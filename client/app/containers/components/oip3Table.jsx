import React from 'react';
import styled from 'styled-components';

const OIP3Table = styled.table`
  border: 1px solid grey;
  border-collapse: collapse;
  margin: 10px 10px;
  width: 95%;
`;

/* eslint-disable react/prop-types */
export default ({ response }) => (
  <OIP3Table>
    <tbody>
      {response.map(([channel, oip3]) => (
        <tr key={`${Math.random()}`}>
          <td>Channel {channel}: </td>
          <td>{+oip3 ? `${oip3}` : ''}</td>
        </tr>
      ))}
    </tbody>
  </OIP3Table>
);
