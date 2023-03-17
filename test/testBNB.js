const { ethers } = require("hardhat")
const { expect } = require("chai")

describe("DepositAndWithdrawUpgradeEth", function () {
  let contract
  let owner
  let withdrawer
  let acc3
  let token1
  let token2
  beforeEach(async function () {
    const tokenContract = await ethers.getContractFactory("MockToken")
    token1 = await tokenContract.deploy()
    await token1.deployed()
    const tokenContractA = await ethers.getContractFactory("DappToken")
    token2 = await tokenContractA.deploy()
    await token2.deployed()
    const getcontract = await ethers.getContractFactory(
      "DepositAndWithdrawUpgradeBNB"
    )

    contract = await upgrades.deployProxy(getcontract)
    await contract.deployTransaction.wait(1)
    contract.addAllowedToken(token1.address)
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
  it("only owner can add allowed tokens", async function () {
    let xyy = await contract.OWNER_ROLE()
    await expect(
      contract.connect(withdrawer).addAllowedToken(token2.address)
    ).to.be.revertedWith(
      `AccessControl: account ${withdrawer.address.toLowerCase()} is missing role ${xyy}`
    )
  })
  it("can't add token if it exists", async function () {
    await expect(contract.addAllowedToken(token1.address)).to.be.revertedWith(
      "token Already Exists"
    )
  })
  it("should deposit bnb", async function () {
    const amount = ethers.utils.parseEther("1")
    await expect(() =>
      owner.sendTransaction({ to: contract.address, value: amount })
    ).to.changeEtherBalance(contract, amount)
    const balance = await contract.bnbBalance()
    expect(balance).to.equal(amount)
  })

  it("should not deposit 0 bnb", async function () {
    const amount = ethers.utils.parseEther("0")
    await expect(contract.DepositBNB({ value: amount })).to.be.revertedWith(
      "the amount should be greater than zero"
    )
  })
  it("should deposit token", async function () {
    const amount = ethers.utils.parseEther("1")
    await token1.approve(contract.address, amount)
    await contract.deposit(token1.address, amount)
    const balancey = await contract.contractTokenBalances(token1.address)
    expect(balancey).to.equal(amount)
  })
  it("should deposit only allowed token", async function () {
    const amount = ethers.utils.parseEther("1")
    await token2.approve(contract.address, amount)
    await expect(contract.deposit(token2.address, amount)).to.be.revertedWith(
      "the token is not currently allowed"
    )
  })
  it("should not deposit more than tokens in wallet", async function () {
    const amount = ethers.utils.parseEther("10000000000000000000000000")
    await token1.approve(contract.address, amount)
    await expect(contract.deposit(token1.address, amount)).to.be.revertedWith(
      "you have insufficient Funds available in your wallet"
    )
  })

  it("should withdraw bnb", async function () {
    const amount = ethers.utils.parseEther("1")
    await owner.sendTransaction({ to: contract.address, value: amount })
    await expect(() =>
      contract.withdrawBNB(owner.address, amount)
    ).to.changeEtherBalance(owner, amount)
    const balance = await contract.bnbBalance()
    expect(balance).to.equal(0)
  })
  it("only owner/withdrawer should with bnb", async function () {
    const amount = ethers.utils.parseEther("2")
    const amountx = ethers.utils.parseEther("1")
    const xy = await contract.WITHDRAWER_ROLE()
    await owner.sendTransaction({ to: contract.address, value: amount })

    await expect(
      contract.connect(acc3).withdrawBNB(owner.address, amount)
    ).to.be.revertedWith(
      `AccessControl: account ${acc3.address.toLowerCase()} is missing role ${xy}`
    )
    await expect(() =>
      contract.withdrawBNB(owner.address, amountx)
    ).to.changeEtherBalance(owner, amountx)
    const balancex = await contract.bnbBalance()
    expect(balancex).to.equal(amountx)
    await expect(() =>
      contract.connect(withdrawer).withdrawBNB(acc3.address, amountx)
    ).to.changeEtherBalance(acc3, amountx)
    const balance = await contract.bnbBalance()
    expect(balance).to.equal(0)
  })

  it("should not withdraw 0 bnb", async function () {
    const amount = ethers.utils.parseEther("0")
    await expect(
      contract.withdrawBNB(owner.address, amount)
    ).to.be.revertedWith("Withdraw an amount greater than 0")
  })

  it("should not withdraw more than balance", async function () {
    const amount = ethers.utils.parseEther("10")
    await expect(
      contract.withdrawBNB(owner.address, amount)
    ).to.be.revertedWith("insufficient bnb available in the contract")
  })
  it("should withdraw token", async function () {
    const amount = ethers.utils.parseEther("1")
    await token1.approve(contract.address, amount)
    await contract.deposit(token1.address, amount)
    await contract.withdraw(acc3.address, token1.address, amount)
    const balance = await contract.contractTokenBalances(token1.address)
    expect(balance).to.equal(0)
  })
  it("only owner/withdrawer should withdraw token", async function () {
    const amount = ethers.utils.parseEther("2")
    const amountx = ethers.utils.parseEther("1")
    const xy = await contract.WITHDRAWER_ROLE()
    await token1.approve(contract.address, amount)
    await contract.deposit(token1.address, amount)
    await expect(
      contract.connect(acc3).withdraw(owner.address, token1.address, amount)
    ).to.be.revertedWith(
      `AccessControl: account ${acc3.address.toLowerCase()} is missing role ${xy}`
    )
    contract.withdraw(owner.address, token1.address, amountx)
    const balancet = await contract.contractTokenBalances(token1.address)
    expect(balancet).to.equal(amountx)
    await contract
      .connect(withdrawer)
      .withdraw(owner.address, token1.address, amountx)
    const balancer = await contract.contractTokenBalances(token1.address)
    expect(balancer).to.equal(0)
  })

  it("should not withdraw 0 token", async function () {
    const amount = ethers.utils.parseEther("0")
    await token1.approve(contract.address, ethers.utils.parseEther("1"))
    await contract.deposit(token1.address, ethers.utils.parseEther("1"))
    await expect(
      contract.withdraw(owner.address, token1.address, amount)
    ).to.be.revertedWith("Withdraw an amount greater than 0")
  })

  it("should not withdraw more token than balance", async function () {
    const amount = ethers.utils.parseEther("10")
    const amountd = ethers.utils.parseEther("1")
    await token1.approve(contract.address, amountd)
    await contract.deposit(token1.address, amountd)
    await expect(
      contract.withdraw(owner.address, token1.address, amount)
    ).to.be.revertedWith("insufficient tokens available in the contract")
  })
  it("should not withdraw not allowed token", async function () {
    const amount = ethers.utils.parseEther("1")
    await expect(
      contract.withdraw(owner.address, token2.address, amount)
    ).to.be.revertedWith("the token is not currently allowed")
  })

  it("should not withdraw when paused", async function () {
    const amount = ethers.utils.parseEther("1")
    await contract.pause()
    await expect(
      contract.withdrawBNB(owner.address, amount)
    ).to.be.revertedWith("Pausable: paused")
  })
})
