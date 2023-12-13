const { createViemClientWithLavaSDK } = require("@lavanet/lava-viem")
const express = require('express');
const { parseAbiItem } = require('viem')

const app = express();
let viemETH; let viemOPTM; let viemARB;

(async () => {
  // Initialize Each Chain
  //ETH1 on LavaSDK Integration
  viemETH = await createViemClientWithLavaSDK({
    badge: {
      badgeServerAddress: "https://badges.lavanet.xyz",
      projectId: " // ", // Fetch your project ID from https://gateway.lavanet.xyz
    },
    geolocation: "2",
    chainIds: "ETH1"
  });

  console.log("🔩 ETH intialized: ", viemETH.name, viemETH.transport.name, viemETH.uid);

  //OPTM on LavaSDK Integration
  viemOPTM = await createViemClientWithLavaSDK({
    badge: {
      badgeServerAddress: "https://badges.lavanet.xyz",
      projectId: " // ", // Fetch your project ID from https://gateway.lavanet.xyz
    },
    chainIds: "OPTM",
    geolocation: "2"
  });

  console.log("🔩 OPTM initialized: ", viemOPTM.name, viemOPTM.transport.name, viemOPTM.uid);

  //ARB1 on LavaSDK Integration
  viemARB = await createViemClientWithLavaSDK({
    badge: {
      badgeServerAddress: "https://badges.lavanet.xyz",
      projectId: " // ", // Fetch your project ID from https://gateway.lavanet.xyz
    },
    chainIds: "ARB1",
    geolocation: "2"
  });

  console.log("🔩 ARB1 initialized: ", viemARB.name, viemARB.transport.name, viemARB.uid);

  //Verify all Public Clients were successfully created
  if (viemETH && viemOPTM && viemARB) {
    console.log("🌋 LavaSDK successfully initialized!")
  } else {
    console.log("LavaSDK failed to initialize! One or more chains could not be reached")
  };
})();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/api/chain/latestblocknum', async (req, res) => {
  console.log("✅ GET - /api/chain/latestblocknum", req.query.chain);
  try {
    const chain = req.query.chain
    const latestBlockNum = await getBlockNumber(chain);

    console.log(`➡️  ${chain} Returned BlockNum: ${latestBlockNum}`)
    res.json({chain: chain, latestBlockNumber: latestBlockNum})
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

// Route to get transaction history
app.get('/api/wallet/transactions', async (req, res) => {
  console.log("✅ GET - /api/wallet/transactions", req.query.address, req.query.chain, `[${req.query.fromBlock} : ${req.query.toBlock}]`);
  // Logic to interact with blockchain and fetch transactions
  try {
    const walletAddress = req.query.address;
    const chain = req.query.chain;
    const fromBlock = req.query.fromBlock; // Assuming these are query parameters
    const toBlock = req.query.toBlock;

    // Check if all required parameters are provided
    if (!walletAddress || !chain || !fromBlock || !toBlock) {
      return res.status(400).json({ error: 'Missing required parameters' });
    };

    //Get and return the Transactions

    const transactions = await getWalletTransactions(walletAddress, chain, fromBlock, toBlock);
    console.log(`➡️  ${chain} Recovered ${transactions.length} TXs from ${walletAddress}`);

    res.json({chain: chain, address: walletAddress, transactions });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

    res.json({chain, address: walletAddress, count: transactionCount });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Add more routes as needed...


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🖥️⚡ Server running on port ${PORT}`);
});


// Execution Logic

// switch between chains - i.e. decide which p2p RPC / publicClient instance to use
async function getClient(chainID) {
  let client;
  switch (chainID) {
    case 'ETH1':
      client = viemETH;
      return client;
    case 'OPTM':
      client = viemOPTM;
      return client;
    case 'ARB1':
      client = viemARB;
      return client;
    default:
      throw new Error(`Unsupported chain: ${chainID}`);
  }
}

// Function that gets wallet balance of a given address on a given chain
async function getWalletBalance(addressInput, chainInput) {

  const client = await getClient(chainInput);

  let balance = await client.getBalance({ address: addressInput });
  return balance;
};

// Function that gets wallet TXs of a given address on a given chain within certain block range
async function getWalletTransactions(addressInput, chainInput, fromBlock, toBlock) {

  const client = await getClient(chainInput);

  // Call the viem getLogs function
  const logs = await client.getLogs({
    address: addressInput,
    event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
    fromBlock: BigInt(fromBlock), // Ensure these are BigInts
    toBlock: BigInt(toBlock),
    // Add more parameters as needed
  });

  return logs;

};

// Function that gets the latest block from the selected chain!
async function getBlockNumber(chainInput) {

  const client = await getClient(chainInput);

  //Call the viem getBlockNumber
  const latestBlockNumber = await client.getBlockNumber();

  //convert to Number
  return Number(latestBlockNumber);
}

// Function that gets the number of TXs from a given address!
async function getWalletTxNumber(addressInput, chainInput) {
  const client = await getClient(chainInput);

  //Call the viem getTxCount
  const txCount = await client.getTransactionCount({address: addressInput});

  return txCount;

};


// HELPER functions

function simplifyJSONIntegers(key, value) {
  if (typeof value === 'bigint') {
    return value.toString();
  } else {
    return value;
  }
}


