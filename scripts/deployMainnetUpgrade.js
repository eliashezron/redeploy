const { ethers, upgrades } = require("hardhat")

async function main() {
  ;[owner] = await ethers.getSigners()
  //   const getcontract = await ethers.getContractFactory(
  //     "DepositAndWithdrawUpgrade"
  //   )
  //   const contractMain = await upgrades.deployProxy(getcontract)
  //   await contractMain.deployTransaction.wait(1)
  //   console.log("contract deployed at ", contractMain.address)
  const contractMain = await ethers.getContractAt(
    "DepositAndWithdrawUpgrade",
    "0xA6b12eb3272Efa631a21A6Da16EB4D4020Bc741D"
  )
  const DappToken = await ethers.getContractAt(
    "DappToken",
    "0x8D672014Fb107cB409dCcd9042DdA3b97313F4C3"
  )

  const approveDT = await DappToken.connect(owner).approve(
    "0xA6b12eb3272Efa631a21A6Da16EB4D4020Bc741D",
    ethers.utils.parseEther("4500")
  )
  await approveDT.wait(1)
  const depositDT = await contractMain
    .connect(owner)
    .deposit(
      "0x8D672014Fb107cB409dCcd9042DdA3b97313F4C3",
      ethers.utils.parseEther("4500")
    )
  await depositDT.wait(1)
  console.log("deposit DappToken successfull")
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
