// src/components/WalletInfo.js
import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Background from './Background'
// import TransactionsTable from './TxTable'

function WalletInfo() {
    const [address, setAddress] = useState('');
    const [chain, setChain] = useState('ETH1');
    const [balance, setBalance] = useState('');
    // const [transactions, setTransactions] = useState([]);
    const [latestBlock, setLatestBlock] = useState('')
    const [txCount, setTxCount] = useState('');
    const [error, setError] = useState('');

    const chainOptions = {
        'ARB1': 'Arbitrum Mainnet',
        'AVAX': 'Avalanche Mainnet',
        'CELO': 'Celo Mainnet',
        'ETH1': 'Ethereum Mainnet',
        'FVM': 'FileCoin Mainnet',
        'OPTM': 'Optimism Mainnet',
        'POLYGON1': 'Polygon Mainnet'
    };

    const fetchWalletBalance = async () => {
        const response = await fetch(`http://localhost:3000/api/wallet/balance?address=${address}&chain=${chain}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setBalance(data.balance);
    };

    const fetchCurrentBlock = async () => {
        const response = await fetch(`http://localhost:3000/api/chain/latest_block_num?chain=${chain}`)
        if (!response.ok) throw new Error(`Error: ${responseLatestBlock.statusText}`);
        const data = await response.json();
        setLatestBlock(data.latestBlockNumber);
    }

    const fetchTransactionCount = async () => {
        const response = await fetch(`http://localhost:3000/api/wallet/transaction_count?chain=${chain}&address=${address}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setTxCount(data.count);
    };

    //   const fetchWalletTransactions = async () => {
 //       const responseTransactions = await fetch(`http://localhost:3000/api/wallet/transactions?address=${address}&chain=${chain}`);
 //       if (!responseTransactions.ok) throw new Error(`Error: ${responseTransactions.statusText}`);
 //       const dataTransactions = await responseTransactions.json();
 //       setTransactions(dataTransactions.transactions || []);
 //   };



    const fetchWalletData = async () => {
        setError('');
        try {
            await fetchCurrentBlock();
            await fetchWalletBalance();
           // await fetchWalletTransactions();
            await fetchTransactionCount();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <center><h1>🌋 The Lava Bazaar</h1>
            <h2>P2P Cross-Chain Asset Checker</h2>
            powered by <a href='https://docs.lavanet.xyz/viem'>Lava & viem</a>

            <Background />
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
                        {Object.entries(chainOptions).map(([value, label]) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchWalletData}
                    style={{ marginTop: '20px' }}
                    startIcon={<AccountBalanceWalletIcon />}
                >
                    Fetch Wallet Data
                </Button>
            </div>

            {balance && <p>Balance: {balance}</p>}
            {txCount && <p>TxCount: {txCount}</p>}
            {latestBlock && <p>Latest Block: {latestBlock}</p>}



            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            </center>
        </div>
    );
}

//            {transactions && transactions.length > 0 ? (
//    <TransactionsTable transactions={transactions} />
//    ) : (
//        <p>No transactions to display</p>
//   )}

export default WalletInfo;