import React from 'react';
import styled from 'styled-components';
import PrintTableCell from './components/printTableCell';

/* eslint-disable react/prop-types */
export default ({ codes }) => (
  <table>
    <tbody>
      <tr>
        <th>State</th>
        <th>Channel 1</th>
        <th>Channel 2</th>
        <th>Channel 3</th>
        <th>Channel 4</th>
        <th>Channel 5</th>
      </tr>
      <tr>
        <td>0</td>
        {codes.map(code => (
          <td rowSpan="4">
            <PrintTableCell
              response={Object.entries(code)
                .sort(([a], [b]) => +a - +b)
                .reduce(
                  (
                    response,
                    [
                      target,
                      {
                        high: [highCode, highdBm],
                        low: [lowCode, lowdBm],
                      },
                    ],
                    i
                  ) => `${response}_${i}|${target}|${lowdBm}:${lowCode}/${highdBm}:${highCode}`,
                  ''
                )}
            />
          </td>
        ))}
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
  </table>
);
