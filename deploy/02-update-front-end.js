const frontEndContractsFile = "../nextjs-my-decentralized-shop/constants/contractAddresses.json"
const frontEndAbiFile = "../nextjs-my-decentralized-shop/constants/abi.json"
const fs = require("fs")
const { network } = require("hardhat")

module.exports = async () => {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
}

async function updateAbi() {
    const shop = await ethers.getContract("Shop")
    fs.writeFileSync(frontEndAbiFile, shop.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const shop = await ethers.getContract("Shop")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (network.config.chainId.toString() in contractAddresses) {
        if (!contractAddresses[network.config.chainId.toString()].includes(shop.address)) {
            contractAddresses[network.config.chainId.toString()].push(shop.address)
        }
    } else {
        contractAddresses[network.config.chainId.toString()] = [shop.address]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
