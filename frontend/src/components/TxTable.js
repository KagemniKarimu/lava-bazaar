import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function TransactionsTable({ transactions }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Transaction ID</TableCell>
            <TableCell align="right">From Address</TableCell>
            <TableCell align="right">To Address</TableCell>
            <TableCell align="right">Value</TableCell>
            {/* Add more headers if needed */}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((tx, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {tx.id}
              </TableCell>
              <TableCell align="right">{tx.from}</TableCell>
              <TableCell align="right">{tx.to}</TableCell>
              <TableCell align="right">{tx.value}</TableCell>
              {/* Add more cells if needed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransactionsTable;
