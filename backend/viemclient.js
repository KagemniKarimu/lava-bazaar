const { createViemClientWithLavaSDK } = require("@lavanet/lava-viem")
// const { parseAbiItem } = require('viem')


const clientList = {};

module.exports = {
    clientList,
    createClientForChain,
    getBlockNumber,
    getWalletBalance,
    // getWalletTransactions,
    getWalletTxNumber,
}

// create clients that use LavaSDK to speak to viem and provide p2p RPC / public client instances
async function createClientForChain(chainID) {
    try {
        const client = await createViemClientWithLavaSDK({
            badge: {
                badgeServerAddress: "https://badges.lavanet.xyz",
                projectId: " // ", // Fetch your project ID from https://gateway.lavanet.xyz
            },
            geolocation: "2",
            chainIds: chainID
        });
        if (client) {
            console.log(`${chainID}  🔩 intialized: `, client.name, client.transport.name, client.uid);
            return client;
        } else {
            console.log(`${chainID} ❌ failed to initialize!`);
        };
    } catch (error) {
        console.log(`❗ Error: ${error}`)
    };
};

// switch between chains - i.e. decide which p2p RPC / publicClient instance to use
async function getClient(chainID) {
    const client = clientList[chainID];
    if (!client) {
        throw new Error(` Unsupported or unitialized chain: ${chainID}`);
    }
    return client;
};


// Function that gets the latest block from the selected chain!
async function getBlockNumber(chainInput) {

    const client = await getClient(chainInput);

    //Call the viem getBlockNumber
    const latestBlockNumber = await client.getBlockNumber();

    //convert to Number
    return Number(latestBlockNumber);
}


// Function that gets wallet balance of a given address on a given chain
async function getWalletBalance(addressInput, chainInput) {

    const client = await getClient(chainInput);

    //Call the viem getBalance
    let balance = await client.getBalance({ address: addressInput });


    return balance;
};


// To Be Implemented (In the Future!)
// Function that gets wallet TXs of a given address on a given chain within certain block range

// async function getWalletTransactions(addressInput, chainInput) {    const client = await getClient(chainInput);
//     
//     // if (fromBlock === undefined || toBlock === undefined) {
//     //    throw new Error("fromBlock or toBlock is undefined");
// 
//     // }
//     console.log(addressInput);
//     console.log(chainInput);
// 
//     // Call the viem getLogs function
//     const logs = await client.getLogs({
//         address: addressInput,
//         // event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
//         // fromBlock: BigInt(fromBlock), // Ensure these are BigInts
//         // toBlock: BigInt(toBlock),
//         // Add more parameters as needed
//     });
//     return logs;
//     
// };



// Function that gets the number of TXs from a given address!
async function getWalletTxNumber(addressInput, chainInput) {
    const client = await getClient(chainInput);

    //Call the viem getTxCount
    const txCount = await client.getTransactionCount({ address: addressInput });

    return txCount;

};