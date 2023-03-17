const { ethers } = require("hardhat")
const { expect } = require("chai")

describe("DepositAndWithdrawUpgradeEth", function () {
  let contract
  let owner
  let withdrawer
  let acc3

  beforeEach(async function () {
    const getcontract = await ethers.getContractFactory(
      "DepositAndWithdrawUpgradeETH"
    )

    contract = await upgrades.deployProxy(getcontract)
    await contract.deployTransaction.wait(1)
    ;[owner, withdrawer, acc3] = await ethers.getSigners()

    await contract.grantRole(await contract.OWNER_ROLE(), owner.address)
    await contract.grantRole(
      await contract.WITHDRAWER_ROLE(),
      withdrawer.address
    )
  })

  it("only owner should grant role", async function () {
    const xyz = await contract.DEFAULT_ADMIN_ROLE()
    const role = await contract.OWNER_ROLE()
    await expect(
      contract.connect(acc3).grantRole(role, acc3.address)
    ).to.be.revertedWith(
      `AccessControl: account ${acc3.address.toLowerCase()} is missing role ${xyz}`
    )
  })
  it("should deposit eth", async function () {
    const amount = ethers.utils.parseEther("1")
    await expect(() =>
      owner.sendTransaction({ to: contract.address, value: amount })
    ).to.changeEtherBalance(contract, amount)
    const balance = await contract.ethBalance()
    expect(balance).to.equal(amount)
  })

  it("should not deposit 0 eth", async function () {
    const amount = ethers.utils.parseEther("0")
    await expect(contract.DepositEth({ value: amount })).to.be.revertedWith(
      "the amount should be greater than zero"
    )
  })

  it("should withdraw eth", async function () {
    const amount = ethers.utils.parseEther("1")
    await owner.sendTransaction({ to: contract.address, value: amount })
    await expect(() =>
      contract.withdrawEth(owner.address, amount)
    ).to.changeEtherBalance(owner, amount)
    const balance = await contract.ethBalance()
    expect(balance).to.equal(0)
  })
  it("only owner/withdrawer should with eth", async function () {
    const amount = ethers.utils.parseEther("2")
    const amountx = ethers.utils.parseEther("1")
    const xy = await contract.WITHDRAWER_ROLE()
    await owner.sendTransaction({ to: contract.address, value: amount })

    await expect(
      contract.connect(acc3).withdrawEth(owner.address, amount)
    ).to.be.revertedWith(
      `AccessControl: account ${acc3.address.toLowerCase()} is missing role ${xy}`
    )
    await expect(() =>
      contract.withdrawEth(owner.address, amountx)
    ).to.changeEtherBalance(owner, amountx)
    const balancex = await contract.ethBalance()
    expect(balancex).to.equal(amountx)
    await expect(() =>
      contract.connect(withdrawer).withdrawEth(acc3.address, amountx)
    ).to.changeEtherBalance(acc3, amountx)
    const balance = await contract.ethBalance()
    expect(balance).to.equal(0)
  })

  it("should not withdraw 0 eth", async function () {
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
