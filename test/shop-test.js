const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("Shop, State Variables and errors", function () {

  let shopFactory, shop
  beforeEach(async function () {
    shopFactory = await ethers.getContractFactory("Shop")
    shop = await shopFactory.deploy()
  })

  it("Should start with 0 items", async function () {
    const initialItems = await shop.getItemAmount()
    const expectedValue = 0
    assert.equal(initialItems, expectedValue)
  })

  it("Should increase the number of items", async function () {
    await shop.listItem("Name", "Description", "Picture", 1)
    const itemsAmount = await shop.getItemAmount()
    const expectedValue = 1
    assert.equal(itemsAmount, expectedValue)
  })

  it("Should revert if trying to buy non listed item", async function () {
    await expect(shop.buyItem(5)).to.be.reverted
  })

  it("Should revert if trying to buy non listed item", async function () {
    await shop.listItem("Name", "Description", "Picture", ethers.utils.parseEther("1"))
    await expect(shop.buyItem(0, {value: ethers.utils.parseEther("2")})).to.be.reverted
  })

  it("Should revert if not enough money to buy the item", async function () {
    await shop.listItem("Name", "Description", "Picture", ethers.utils.parseEther("5"))
    const mySigner = await ethers.getSigner(1);
    await expect(shop.connect(mySigner).buyItem(0, {value: ethers.utils.parseEther("1")})).to.be.reverted
  })

  it("Should revert if trying to cancel a non owned item", async function () {
    await shop.listItem("Name", "Description", "Picture", 1)
    const mySigner = await ethers.getSigner(1);
    await expect(shop.connect(mySigner).cancelItem(0)).to.be.reverted
  })

  it("Should return the listed item", async function () {
    await shop.listItem("Name", "Description", "Picture", 1)
    const item = await shop.getListedItem(0)
    assert.equal(item, "Name")
  })
})

describe("Shop, Events", function () {

  let shopFactory, shop
  beforeEach(async function () {
    shopFactory = await ethers.getContractFactory("Shop")
    shop = await shopFactory.deploy()
    owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  })

  it("Should emit Listed event", async function () {
    await expect(shop.listItem("Name", "Description", "Picture", 1))
      .to.emit(shop, "ItemListed")
      .withArgs("Name", owner, 0, 1);
  })

  it("Should emit Bought event", async function () {
    const mySigner = await ethers.getSigner(1);
    const buyer = await mySigner.getAddress()
    await shop.listItem("Name", "Description", "Picture", 1)
    await expect(shop.connect(mySigner).buyItem(0, {value: 2}))
      .to.emit(shop, "ItemBought")
      .withArgs("Name", buyer, 0);
  })

  it("Should emit Cancelled event", async function () {
    await shop.listItem("Name", "Description", "Picture", 1)
    await expect(shop.cancelItem(0))
      .to.emit(shop, "ItemCancelled")
      .withArgs("Name", 0);
  })
})
 

  
