const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleDEX", function () {
  let dex;
  let tokenA;
  let tokenB;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy test tokens
    const Token = await ethers.getContractFactory("DCX");
    tokenA = await Token.deploy();
    await tokenA.waitForDeployment();
    
    tokenB = await Token.deploy();
    await tokenB.waitForDeployment();
    
    // Deploy SimpleDEX
    const SimpleDEX = await ethers.getContractFactory("SimpleDEX");
    dex = await SimpleDEX.deploy(tokenA.target, tokenB.target);
    await dex.waitForDeployment();
    
    // Transfer some tokens to addr1 for testing
    await tokenA.transfer(addr1.address, ethers.parseEther("5000"));
    await tokenB.transfer(addr1.address, ethers.parseEther("5000"));
  });

  describe("Deployment", function () {
    it("Should set the correct token addresses", async function () {
      expect(await dex.tokenA()).to.equal(tokenA.target);
      expect(await dex.tokenB()).to.equal(tokenB.target);
    });

    it("Should initialize with zero reserves", async function () {
      expect(await dex.reserveA()).to.equal(0);
      expect(await dex.reserveB()).to.equal(0);
    });
  });

  describe("Add Liquidity", function () {
    it("Should add liquidity successfully", async function () {
      const amountA = ethers.parseEther("100");
      const amountB = ethers.parseEther("200");
      
      // Approve tokens
      await tokenA.connect(addr1).approve(dex.target, amountA);
      await tokenB.connect(addr1).approve(dex.target, amountB);
      
      // Add liquidity
      await dex.connect(addr1).addLiquidity(amountA, amountB);
      
      expect(await dex.reserveA()).to.equal(amountA);
      expect(await dex.reserveB()).to.equal(amountB);
      expect(await tokenA.balanceOf(dex.target)).to.equal(amountA);
      expect(await tokenB.balanceOf(dex.target)).to.equal(amountB);
    });

    it("Should fail with zero amounts", async function () {
      await expect(
        dex.connect(addr1).addLiquidity(0, ethers.parseEther("100"))
      ).to.be.revertedWith("Amounts must be positive");
      
      await expect(
        dex.connect(addr1).addLiquidity(ethers.parseEther("100"), 0)
      ).to.be.revertedWith("Amounts must be positive");
    });

    it("Should fail without sufficient allowance", async function () {
      const amountA = ethers.parseEther("100");
      const amountB = ethers.parseEther("200");
      
      await expect(
        dex.connect(addr1).addLiquidity(amountA, amountB)
      ).to.be.revertedWithCustomError(tokenA, "ERC20InsufficientAllowance");
    });
  });

  describe("Swap", function () {
    beforeEach(async function () {
      // Add initial liquidity
      const amountA = ethers.parseEther("1000");
      const amountB = ethers.parseEther("2000");
      
      await tokenA.connect(addr1).approve(dex.target, amountA);
      await tokenB.connect(addr1).approve(dex.target, amountB);
      await dex.connect(addr1).addLiquidity(amountA, amountB);
    });

    it("Should swap tokenA for tokenB", async function () {
      const swapAmount = ethers.parseEther("100");
      const expectedOutput = ethers.parseEther("200"); // Based on 1:2 ratio
      
      await tokenA.connect(addr1).approve(dex.target, swapAmount);
      
      const initialBalanceB = await tokenB.balanceOf(addr1.address);
      await dex.connect(addr1).swap(tokenA.target, swapAmount, 0);
      const finalBalanceB = await tokenB.balanceOf(addr1.address);
      
      expect(finalBalanceB - initialBalanceB).to.be.closeTo(expectedOutput, ethers.parseEther("1"));
    });

    it("Should swap tokenB for tokenA", async function () {
      const swapAmount = ethers.parseEther("200");
      const expectedOutput = ethers.parseEther("100"); // Based on 2:1 ratio
      
      await tokenB.connect(addr1).approve(dex.target, swapAmount);
      
      const initialBalanceA = await tokenA.balanceOf(addr1.address);
      await dex.connect(addr1).swap(tokenB.target, swapAmount, 0);
      const finalBalanceA = await tokenA.balanceOf(addr1.address);
      
      expect(finalBalanceA - initialBalanceA).to.be.closeTo(expectedOutput, ethers.parseEther("1"));
    });

    it("Should fail with invalid token", async function () {
      const swapAmount = ethers.parseEther("100");
      
      await expect(
        dex.connect(addr1).swap(addr2.address, swapAmount, 0)
      ).to.be.revertedWith("Invalid token");
    });

    it("Should fail with zero amount", async function () {
      await expect(
        dex.connect(addr1).swap(tokenA.target, 0, 0)
      ).to.be.revertedWith("Amount must be positive");
    });

    it("Should fail if output is less than minimum", async function () {
      const swapAmount = ethers.parseEther("100");
      const minOutput = ethers.parseEther("1000"); // Unrealistically high
      
      await tokenA.connect(addr1).approve(dex.target, swapAmount);
      
      await expect(
        dex.connect(addr1).swap(tokenA.target, swapAmount, minOutput)
      ).to.be.revertedWith("Insufficient output");
    });
  });
});
