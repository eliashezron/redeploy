require("dotenv").config()
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require("@openzeppelin/hardhat-upgrades")
require("@nomiclabs/hardhat-etherscan")
require("ethers")
<<<<<<< HEAD
require("hardhat-gas-reporter")
=======
>>>>>>> origin/main
module.exports = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      bsc: process.env.BSC_API_KEY,
      bscTestnet: process.env.BSC_API_KEY,
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
    mainnet: {
<<<<<<< HEAD
      url: `https://eth-mainnet.g.alchemy.com/v2/1SU2dtkiWsvkLBInRr248QsChkkewEqO`,
=======
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
>>>>>>> origin/main
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true,
      chainId: 1,
      timeoutBlocks: 2000,
      gas: 2100000,
      gasPrice: 30000000000,
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY],
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
<<<<<<< HEAD
  gasReporter: {
    // enabled: true,
    currency: "USD",
    token: "ETH",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
=======
>>>>>>> origin/main
}
