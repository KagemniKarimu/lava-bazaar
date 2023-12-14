
const express = require('express');
const { createClientForChain,
  clientList,
  getBlockNumber,
  getWalletBalance,
  // getWalletTransactions, 
  getWalletTxNumber } = require('./viemclient.js');

const app = express();


// ***** INITIALIZATION *****

//Change the List of Supported Chains by adding Lava's SpecIndex/ChainID to this Array
const supportedChains = ["ARB1", "AVAX", "CELO", "ETH1", "FVM", "OPTM", "POLYGON1"];

// Asynchronously Connect all P2P RPC
(async () => {

  // Initialize Each Chain - this can also be done in Parallel with Promises for greater ⚡

  for (const chain of supportedChains) {
    const client = await createClientForChain(chain);
    clientList[chain] = client;
  }

  //Verify correct # of Public Clients were successfully created
  if (supportedChains.length == Object.keys(clientList).length) {
    console.log("🌋 LavaSDK successfully initialized!")
  } else {
    console.log("LavaSDK failed to initialize! One or more chains could not be reached")
  };

})();


// ***** ROUTES / ROUTING *****

app.get('/', (req, res) => {
  res.send('P2P RPC Server');
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route to get LatestBlockNumber
app.get('/api/chain/latest_block_num', async (req, res) => {
  console.log("✅ GET - /api/chain/latest_block_num", req.query.chain);
  try {
    const chain = req.query.chain
    const latestBlockNum = await getBlockNumber(chain);

    console.log(`➡️  ${chain} Returned BlockNum: ${latestBlockNum}`)
    res.json({ chain: chain, latestBlockNumber: latestBlockNum })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Route to get wallet balances
app.get('/api/wallet/balance', async (req, res) => {
  console.log("✅ GET - /api/wallet/balance", req.query.address, req.query.chain);
  try {
    const walletAddress = req.query.address;
    const chain = req.query.chain
    const balance = await getWalletBalance(walletAddress, chain); // Your function to get the balance
    const balanceString = balance.toString();

    console.log(`➡️  ${chain} Returned Balance: ${balance} for ${walletAddress}`)
    res.json({ chain: chain, address: walletAddress, balance: balanceString });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  // Logic to interact with blockchain and fetch balance
});

// Route to get transaction history (DISABLED!)
//app.get('/api/wallet/transactions', async (req, res) => {
//  console.log("✅ GET - /api/wallet/transactions", req.query.address, req.query.chain);
//  // Logic to interact with blockchain and fetch transactions
//
//  try {
//    const { address: walletAddress, chain } = req.query;
//
//    if (!walletAddress || !chain) {
//      return res.status(400).json({ error: 'Missing required parameters' });
//    };
//
//    const transactions = await getWalletTransactions(walletAddress, chain);
//    console.log(`➡️  ${chain} Recovered ${transactions.length} TXs from ${walletAddress}`);
//
//    res.json(JSON.stringify({ chain, address: walletAddress, transactions }, simplifyJSONIntegers));
//  } catch (error) {
//    console.error(error);
//    res.status(500).json({ error: error.message });
//  }
//});

//Route to get Transaction Count
app.get('/api/wallet/transaction_count', async (req, res) => {
  console.log("✅ GET - /api/wallet/transaction_count", req.query.address, req.query.chain);
  // Logic to interact with blockchain and fetch transactions
  try {
    const walletAddress = req.query.address;
    const chain = req.query.chain;

    // Check if all required parameters are provided
    if (!walletAddress || !chain) {
      return res.status(400).json({ error: 'Missing required parameters' });
    };

    //Get and return the Transactions

    const transactionCount = await getWalletTxNumber(walletAddress, chain);
    console.log(`➡️  ${chain} Counted ${transactionCount} TXs on ${walletAddress}`);

    res.json({ chain, address: walletAddress, count: transactionCount });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Add more routes as needed...


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🖥️⚡ Server running on port ${PORT}`);
});





// *** HELPER functions *** 

function simplifyJSONIntegers(key, value) {
  if (typeof value === 'bigint') {
    return value.toString();
  } else {
    return value;
  }
}


