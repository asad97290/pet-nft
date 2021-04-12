const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
require("dotenv").config();


module.exports = {

  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.INFURA_URL),
      network_id: 3, // eslint-disable-line camelcase
      gas: 5500000, // Ropsten has a lower block limit than mainnet
      // confirmations: 2, // # of confs to wait between deployments. (default: 0)
      // timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      // skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    }
  },
   // Configure your compilers
   compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};
