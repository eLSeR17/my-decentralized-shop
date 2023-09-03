const { ethers } = require("hardhat")
const { expect, assert } = require("chai")
const { call } = require("@openzeppelin/test-helpers")

describe("Users, State Variables", function () {

  let usersFactory, users
  beforeEach(async function () {
    usersFactory = await ethers.getContractFactory("Users")
    users = await usersFactory.deploy()
    owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  })

  it("Should revert if not enough points to become embassador", async function () {
    const address = ethers.utils.getAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
    await expect(users.makeEmbassador(address)).to.be.reverted
  })

  it("Should revert if owner has not enough power", async function () {
    const mySigner = await ethers.getSigner(1);
    const address = mySigner.getAddress();
    await users.givePoints(address, 700)
    await users.makeEmbassador(address)
    await expect(users.cancelEmbassador(address)).to.be.reverted
  })

  it("Should revert if user is not embassador to be cancelled", async function () {
    const address = ethers.utils.getAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
    await expect(users.cancelEmbassador(address)).to.be.reverted
  })

  it("Should revert if user is not embassador to evaluate", async function () {
    const mySigner = await ethers.getSigner(1);
    await expect(users.connect(mySigner).evaluateOwner(8)).to.be.reverted
  })

  it("Should not be embassador", async function () {
    const mySigner = await ethers.getSigner(1);
    const address = mySigner.getAddress();
    await users.givePoints(address, 700)
    await users.makeEmbassador(address)
    await users.connect(mySigner).evaluateOwner(9)
    await users.cancelEmbassador(address)
    const isEmbassador = await users.checkEmbassador(address)
    assert.equal(isEmbassador, false)
  })

  it("Should revert if user already evaluated", async function () {
    const mySigner = await ethers.getSigner(1);
    const address = mySigner.getAddress();
    await users.givePoints(address, 700)
    await users.makeEmbassador(address)
    await users.connect(mySigner).evaluateOwner(9)
    await expect(users.connect(mySigner).evaluateOwner(9)).to.be.reverted
  })

  it("Should revert if grade is out of ranges", async function () {
    const address = ethers.utils.getAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
    await users.givePoints(address, 700)
    await users.makeEmbassador(address)
    await expect(users.connect(address).evaluateOwner(12)).to.be.reverted
  })

  it("Should work if tries to evaluate", async function () {
    const mySigner = await ethers.getSigner(1);
    const address = mySigner.getAddress();
    await users.givePoints(address, 700)
    await users.makeEmbassador(address)
    await users.connect(mySigner).evaluateOwner(8)
    const currentVotes = await users.getOwnerVotes()
    assert.equal(currentVotes.toString(), "1")
  })

  it("Should return the correct address", async function () {
    const myAddress = "myAddress"
    await users.setMyAddress("myAddress")
    const realAddress = await users.getMyAddress()
    assert.equal(myAddress, realAddress)
  })

  it("Should return the correct mail", async function () {
    const myMail = "myMail"
    await users.setMyMail("myMail")
    const realMail = await users.getMyMail()
    assert.equal(myMail, realMail)
  })

  it("Should return the correct telephone", async function () {
    const myTelephone = "myTelephone"
    await users.setMyTelephone("myTelephone")
    const realTelephone = await users.getMyTelephone()
    assert.equal(myTelephone, realTelephone)
  })

  it("Should return level 5", async function () {
    const mySigner = await ethers.getSigner(1);
    const address = mySigner.getAddress();
    await users.givePoints(address, 700)
    const level = await users.connect(mySigner).getMyLevel()
    assert.equal(level, 5)
  })
})

describe("Users, Events", function () {

  let usersFactory, users
  beforeEach(async function () {
    usersFactory = await ethers.getContractFactory("Users")
    users = await usersFactory.deploy()
    owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  })

  it("Should emit AddressWasSet event", async function () {
    await expect(users.setMyAddress("myAddress"))
      .to.emit(users, "AddressWasSet")
      .withArgs(owner, "myAddress");
  })

  it("Should emit MailWasSet event", async function () {
    await expect(users.setMyMail("myMail"))
      .to.emit(users, "MailWasSet")
      .withArgs(owner, "myMail");
  })

  it("Should emit TelephoneWasSet event", async function () {
    await expect(users.setMyTelephone("myTelephone"))
      .to.emit(users, "TelephoneWasSet")
      .withArgs(owner, "myTelephone");
  })

})
 

  
