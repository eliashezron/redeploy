require("dotenv").config()
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require("@openzeppelin/hardhat-upgrades")
require("@nomiclabs/hardhat-etherscan")
require("ethers")
// require("@nomiclabs/hardhat-web3")
// require("hardhat-deploy")
// FEANRUXR1JIHDQ76YXIDFV5PE27EIJRNPA
// 6UKT81CI5KJVJFJCXKZV7RIXKYNJM27TCB
module.exports = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      bsc: process.env.BSC_API_KEY,
      bscTestnet: process.env.BSC_API_KEY,
      rinkeby: process.env.ETHERSCAN_API_KEY,
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
    mainnet: {
      url: "https://speedy-nodes-nyc.moralis.io/27da94136479eb96f635fbf9/eth/mainnet",
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true,
      chainId: 1,
      timeoutBlocks: 2000,
      gas: 2100000,
      gasPrice: 30000000000,
    },
    rinkeby: {
      url: "https://speedy-nodes-nyc.moralis.io/0f495cca072b76ea382641a6/eth/rinkeby",
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true,
      chainId: 4,
      gas: 2100000,
      gasPrice: 8000000000,
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
}
// 0x068726825cadC89558D8f9173b4782E6A170cEcd
// 0x9ce8e27ee2fbd2de6b15d631ff0f6ba90f0fbf16
