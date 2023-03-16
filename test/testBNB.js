import { ethers } from "hardhat"
import { expect } from "chai"
const { readFileSync } = require("fs")

describe("DepositAndWithdrawUpgradeEth", function () {
  let contract
  let owner
  let withdrawer
  function getInstance() {
    const address = JSON.parse(readFileSync("cashOutAddresses.json"))[
      proxyContract
    ]
    if (!address)
      throw new Error(`Contract ${proxyContract} not found in deploy.json`)
    return ethers
      .getContractFactory("CashOutContract")
      .then((f) => f.attach(address))
  }
  beforeEach(async function () {
    const contract = getInstance()
    ;[owner, withdrawer] = await ethers.getSigners()
    await contract.grantRole(await contract.OWNER_ROLE(), owner.address)
    await contract.grantRole(
      await contract.WITHDRAWER_ROLE(),
      withdrawer.address
    )
  })

  it("should deposit ether", async function () {
    const amount = ethers.utils.parseEther("1")
    await expect(() =>
      owner.sendTransaction({ to: contract.address, value: amount })
    ).to.changeEtherBalance(contract, amount)
    const balance = await contract.ethBalance()
    expect(balance).to.equal(amount)
  })

  it("should not deposit 0 ether", async function () {
    const amount = ethers.utils.parseEther("0")
    await expect(contract.depositEth({ value: amount })).to.be.revertedWith(
      "the amount should be greater than zero"
    )
  })

  it("should withdraw ether", async function () {
    const amount = ethers.utils.parseEther("1")
    await owner.sendTransaction({ to: contract.address, value: amount })
    await expect(() =>
      contract.withdrawEth(owner.address, amount)
    ).to.changeEtherBalance(owner, amount)
    const balance = await contract.ethBalance()
    expect(balance).to.equal(0)
  })

  it("should not withdraw 0 ether", async function () {
    const amount = ethers.utils.parseEther("0")
    await expect(
      contract.withdrawEth(owner.address, amount)
    ).to.be.revertedWith("Withdraw an amount greater than 0")
  })

  it("should not withdraw more than balance", async function () {
    const amount = ethers.utils.parseEther("10")
    await expect(
      contract.withdrawEth(owner.address, amount)
    ).to.be.revertedWith("insufficient eth available in the contract")
  })

  it("should not withdraw when paused", async function () {
    const amount = ethers.utils.parseEther("1")
    await contract.pause()
    await expect(
      contract.withdrawEth(owner.address, amount)
    ).to.be.revertedWith("Pausable: paused")
  })
})
