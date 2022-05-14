const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank", function () {
    let bank
    let matic
    let shib
    let usdt
    let owner
    let user

    beforeEach(async () => {
        [owner] = await ethers.getSigners();

        let Bank = await ethers.getContractFactory("Bank")
        bank = await Bank.deploy()
        await bank.deployed()

        let Matic = await ethers.getContractFactory("Matic")
        matic = await Matic.deploy()
        await matic.deployed()

        let Shib = await ethers.getContractFactory("Shib")
        shib = await Shib.deploy()
        await shib.deployed()

        let Usdt = await ethers.getContractFactory("Usdt")
        usdt = await Usdt.deploy()
        await usdt.deployed()
    })

    describe("Should store the allowed token addressed", async function () {
        it("Stores the allowed tokens addresses", async function () {
            await bank.selectTokens(ethers.utils.formatBytes32String('matic'),matic.address)
            await bank.selectTokens(ethers.utils.formatBytes32String('shib'),shib.address)
            await bank.selectTokens(ethers.utils.formatBytes32String('usdt'),usdt.address)
            let allowed_symbols = await bank.getAllowedSymbols()
            expect(matic.address).to.equal(await bank.getAllowedTokensAddress(allowed_symbols[0]))
            expect(shib.address).to.equal(await bank.getAllowedTokensAddress(allowed_symbols[1]))
            expect(usdt.address).to.equal(await bank.getAllowedTokensAddress(allowed_symbols[2]))
        })
    })

    describe("Deposits and withdraws tokens successfully", async function () {
        // ETH
        it("ETH", async function () {
            // Deposit
            await owner.sendTransaction({to:bank.address.toString(), value:ethers.utils.parseEther("1")})
            let amount = await bank.getTokenBalance(ethers.utils.formatBytes32String('eth'))
            expect(ethers.utils.formatEther(amount.toString())).to.equal("1.0")
            
            // Withdraw
            await expect(bank.withdrawEther(ethers.utils.parseEther("2")))
            .to.be.reverted; // Insufficient funds
            await bank.withdrawEther(ethers.utils.parseEther("1"))
            amount = await bank.getTokenBalance(ethers.utils.formatBytes32String('eth'))
            expect(ethers.utils.formatEther(amount.toString())).to.equal("0.0")
        })


        // Matic
        it("Matic", async function () {
            // Deposit
            await owner.sendTransaction({to:bank.address.toString(), value:ethers.utils.parseEther("1")})

            await bank.selectTokens(ethers.utils.formatBytes32String('matic'),matic.address)
            await matic.connect(owner).approve(bank.address, ethers.utils.parseEther("1"))
            await bank.connect(owner).depositTokens(
                ethers.utils.parseEther("1"), ethers.utils.formatBytes32String('matic')
            )
            let amount = await bank.getTokenBalance(ethers.utils.formatBytes32String('matic'))
            expect(ethers.utils.formatEther(amount.toString())).to.equal("1.0")
            
            // Withdraw
            await expect(bank.connect(owner).withdrawTokens(
                ethers.utils.parseEther("2"), ethers.utils.formatBytes32String('matic')
            )).to.be.reverted
            await bank.connect(owner).withdrawTokens(
                ethers.utils.parseEther("1.0"), ethers.utils.formatBytes32String('matic')
            )
            amount = await bank.getTokenBalance(ethers.utils.formatBytes32String('matic'))
            expect(ethers.utils.formatEther(amount.toString())).to.equal("0.0")
        })

        // Shib
        it("Shib", async function () {
            // Deposit
            await owner.sendTransaction({to:bank.address.toString(), value:ethers.utils.parseEther("1")})

            await bank.selectTokens(ethers.utils.formatBytes32String('shib'),shib.address)
            await shib.connect(owner).approve(bank.address, ethers.utils.parseEther("1"))
            await bank.connect(owner).depositTokens(
                ethers.utils.parseEther("1"), ethers.utils.formatBytes32String('shib')
            )
            let amount = await bank.getTokenBalance(ethers.utils.formatBytes32String('shib'))
            expect(ethers.utils.formatEther(amount.toString())).to.equal("1.0")
            
            // Withdraw
            await expect(bank.connect(owner).withdrawTokens(
                ethers.utils.parseEther("2"), ethers.utils.formatBytes32String('shib')
            )).to.be.reverted
            await bank.connect(owner).withdrawTokens(
                ethers.utils.parseEther("1.0"), ethers.utils.formatBytes32String('shib')
            )
            amount = await bank.getTokenBalance(ethers.utils.formatBytes32String('shib'))
            expect(ethers.utils.formatEther(amount.toString())).to.equal("0.0")
        })

        // Usdt
        it("Usdt", async function () {
            // Deposit
            await owner.sendTransaction({to:bank.address.toString(), value:ethers.utils.parseEther("1")})

            await bank.selectTokens(ethers.utils.formatBytes32String('usdt'),usdt.address)
            await usdt.connect(owner).approve(bank.address, ethers.utils.parseEther("1"))
            await bank.connect(owner).depositTokens(
                ethers.utils.parseEther("1"), ethers.utils.formatBytes32String('usdt')
            )
            let amount = await bank.getTokenBalance(ethers.utils.formatBytes32String('usdt'))
            expect(ethers.utils.formatEther(amount.toString())).to.equal("1.0")
            
            // Withdraw
            await expect(bank.connect(owner).withdrawTokens(
                ethers.utils.parseEther("2"), ethers.utils.formatBytes32String('usdt')
            )).to.be.reverted
            await bank.connect(owner).withdrawTokens(
                ethers.utils.parseEther("1.0"), ethers.utils.formatBytes32String('usdt')
            )
            amount = await bank.getTokenBalance(ethers.utils.formatBytes32String('usdt'))
            expect(ethers.utils.formatEther(amount.toString())).to.equal("0.0")
        })
    })
  })