// src/components/WalletInfo.js
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

function WalletInfo() {
    const [address, setAddress] = useState('');
    const [chain, setChain] = useState('ETH1');
    const [balance, setBalance] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [txCount, setTxCount] = useState('');
    const [error, setError] = useState('');

    const fetchWalletBalance = async () => {
        const response = await fetch(`http://localhost:3000/api/wallet/balance?address=${address}&chain=${chain}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setBalance(data.balance);
    };

    const fetchWalletTransactions = async () => {
        const responseLatestBlock = await fetch(`http://localhost:3000/api/chain/latestblocknum?chain=${chain}`);
        if (!responseLatestBlock.ok) throw new Error(`Error: ${responseLatestBlock.statusText}`);
        const dataLatestBlock = await responseLatestBlock.json();

        const latestBlockNumber = dataLatestBlock.latestBlockNumber;
        const responseTransactions = await fetch(`http://localhost:3000/api/wallet/transactions?address=${address}&chain=${chain}&fromBlock=${0}&toBlock=${latestBlockNumber}`);
        if (!responseTransactions.ok) throw new Error(`Error: ${responseTransactions.statusText}`);
        const dataTransactions = await responseTransactions.json();
        setTransactions(dataTransactions.transactions || []);
    };

    const fetchTransactionCount = async () => {
        const response = await fetch(`http://localhost:3000/api/wallet/transaction_count?chain=${chain}&address=${address}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setTxCount(data.count);
    };

    const fetchWalletData = async () => {
        setError('');
        try {
            await fetchWalletBalance();
            await fetchWalletTransactions();
            await fetchTransactionCount();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <center><h1>Wallet Balance Checker</h1></center>
            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="Wallet Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Blockchain</InputLabel>
                    <Select
                        value={chain}
                        onChange={(e) => setChain(e.target.value)}
                        label="Blockchain"
                    >
                        <MenuItem value="ETH1">Ethereum</MenuItem>
                        <MenuItem value="OPTM">Optimism</MenuItem>
                        <MenuItem value="ARB1">Arbitrum</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchWalletData}
                    style={{ marginTop: '20px' }}
                >
                    Fetch Wallet Data
                </Button>
            </div>

            {balance && <p>Balance: {balance}</p>}
            {txCount && <p>TxCount: {txCount}</p>}



            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
}

export default WalletInfo;