// imports
const {ethers, network} = require("hardhat")
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")


module.exports = async ({ getNamedAccounts, deployments }) => {

const { deploy, log } = deployments
const [deployer] = await ethers.getSigners()
const chainId = network.config.chainId

const shop = await deploy("Shop", {
  from: deployer.address,
  args: [],
  log: true,
  waitConfirmations: 6,
})

// Verify the deployment
if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  log("Verifying...")
  await verify(shop.address, [])
}

log("Enter lottery with command:")
const networkName = network.name == "hardhat" ? "localhost" : network.name
log(`yarn hardhat run scripts/enterRaffle.js --network ${networkName}`)
log("----------------------------------------------------")
}

module.exports.tags = ["all", "shop"]
