import React, { Fragment } from 'react';
import styled from 'styled-components';

const Cell = styled.td`
  border: 1px solid grey;
`;

const ShadedCell = styled(Cell)`
  background-color: #ddd;
`;

/* eslint-disable react/prop-types */
export default ({ response, withOutState }) => {
  const [state, target, actual] = response.split('|');
  const [[actualL, codeL], [actualH, codeH]] = actual.split('/').map(value => value.split(':'));
  return (
    <Fragment>
      <tr>
        {withOutState ? null : <Cell rowSpan="2">{state}</Cell>}
        <Cell rowSpan="2">{target}</Cell>
        <ShadedCell>{actualL === '> 1.5' ? `> ${+target + 1.5}` : actualL}</ShadedCell>
        <ShadedCell style={withOutState ? { fontSize: '150%' } : {}}>{codeL}</ShadedCell>
      </tr>
      <tr>
        <Cell>{actualH === '> 1.5' ? `> ${+target + 1.5}` : actualH}</Cell>
        <Cell style={withOutState ? { fontSize: '150%' } : {}}>{codeH}</Cell>
      </tr>
    </Fragment>
  );
};
