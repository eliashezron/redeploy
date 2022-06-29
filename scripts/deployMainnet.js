const { ethers, upgrades } = require("hardhat")

async function main() {
  ;[owner] = await ethers.getSigners()
  const getcontract = await ethers.getContractFactory("DepositAndWithdraw")
  const contractMain = await upgrades.deployProxy(getcontract)
  await contractMain.deployTransaction.wait(1)
  console.log("contract deployed at ", contractMain.address)
}

// https://bscscan.com/address/0x9cE8E27EE2fbd2DE6b15d631ff0F6bA90F0FbF16#code
// operator ADDRESS :0x4eEf08734a989A064715AE974B4aD10c2e661399

// deposit wallet: 0xb4c5402ba6765E6b535c6Fcc1313A65c963df2A8
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
