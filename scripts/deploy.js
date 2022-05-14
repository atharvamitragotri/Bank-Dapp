const { ethers } = require("hardhat")

const main = async () => {
    let [owner, user] = await ethers.getSigners()

    const Bank = await ethers.getContractFactory("Bank", owner)
    const bank = await Bank.deploy()

    const Matic = await ethers.getContractFactory("Matic", user)
    const matic = await Matic.deploy()
    const Shib = await ethers.getContractFactory("Shib", user)
    const shib = await Shib.deploy()
    const Usdt = await ethers.getContractFactory("Usdt", user)
    const usdt = await Usdt.deploy()

    await bank.selectTokens(ethers.utils.formatBytes32String('matic'),matic.address)
    await bank.selectTokens(ethers.utils.formatBytes32String('shib'),shib.address)
    await bank.selectTokens(ethers.utils.formatBytes32String('usdt'),usdt.address)
    await bank.selectTokens(ethers.utils.formatBytes32String('eth'),ethers.constants.AddressZero)

    console.log(`Bank deployed to ${bank.address} by ${owner.address}`)
    console.log(`Matic deployed to ${matic.address} by ${user.address}`)
    console.log(`Shib deployed to ${shib.address} by ${user.address}`)
    console.log(`Tether deployed to ${usdt.address} by ${user.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });