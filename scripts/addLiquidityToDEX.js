const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const dcxAddress = "0xB287080120d6eA274dA0C1E1c8138003D4B5eB5F";
  const dcAddress = "0x7B4328c127B85369D9f82ca0503B000D09CF9180";
  const dexAddress = "0x56DEB47AC4403D48d7111B6365cd1866B01f8d13";

  const dcx = await ethers.getContractAt("ERC20", dcxAddress);
  const dc = await ethers.getContractAt("ERC20", dcAddress);
  const dex = await ethers.getContractAt("SimpleDEX", dexAddress);

  const amountDCX = ethers.parseEther("1000000");
  const amountDC = ethers.parseEther("10");

  // Approve
  console.log("Approving DCX...");
  await dcx.approve(dexAddress, amountDCX);
  console.log("Approving DC...");
  await dc.approve(dexAddress, amountDC);

  // Add liquidity
  console.log("Adding liquidity...");
  await dex.addLiquidity(amountDCX, amountDC);
  console.log("Liquidity added to SimpleDEX. Pool created with DCX and DC.");
}

main().catch(console.error);
