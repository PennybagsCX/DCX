const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DCX Token", function () {
  let dcx;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const DCX = await ethers.getContractFactory("DCX");
    dcx = await DCX.deploy();
    await dcx.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await dcx.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await dcx.balanceOf(owner.address);
      expect(await dcx.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct name and symbol", async function () {
      expect(await dcx.name()).to.equal("DCX");
      expect(await dcx.symbol()).to.equal("DCX");
    });

    it("Should have 18 decimals", async function () {
      expect(await dcx.decimals()).to.equal(18);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("50");
      
      await dcx.transfer(addr1.address, transferAmount);
      const addr1Balance = await dcx.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);

      await dcx.connect(addr1).transfer(addr2.address, transferAmount);
      const addr2Balance = await dcx.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await dcx.balanceOf(owner.address);
      const transferAmount = initialOwnerBalance + 1n;

      await expect(
        dcx.connect(addr1).transfer(owner.address, transferAmount)
      ).to.be.revertedWithCustomError(dcx, "ERC20InsufficientBalance");
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await dcx.balanceOf(owner.address);
      const transferAmount = ethers.parseEther("100");

      await dcx.transfer(addr1.address, transferAmount);
      await dcx.transfer(addr2.address, transferAmount);

      const finalOwnerBalance = await dcx.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - transferAmount * 2n);

      const addr1Balance = await dcx.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);

      const addr2Balance = await dcx.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });
  });

  describe("Allowances", function () {
    it("Should approve tokens for delegated transfer", async function () {
      const approveAmount = ethers.parseEther("100");
      
      await dcx.approve(addr1.address, approveAmount);
      expect(await dcx.allowance(owner.address, addr1.address)).to.equal(approveAmount);
    });

    it("Should allow delegated transfers", async function () {
      const approveAmount = ethers.parseEther("100");
      const transferAmount = ethers.parseEther("50");
      
      await dcx.approve(addr1.address, approveAmount);
      await dcx.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);
      
      expect(await dcx.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await dcx.allowance(owner.address, addr1.address)).to.equal(approveAmount - transferAmount);
    });
  });
});
