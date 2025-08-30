const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // DCX contract address
  const dcxAddress = "0xB287080120d6eA274dA0C1E1c8138003D4B5eB5F";

  // DC token address
  const dcAddress = "0x7B4328c127B85369D9f82ca0503B000D09CF9180";

  // Deploy SimpleDEX
  const SimpleDEX = await ethers.getContractFactory("SimpleDEX");
  const dex = await SimpleDEX.deploy(dcxAddress, dcAddress);
  await dex.waitForDeployment();
  console.log("SimpleDEX deployed at:", dex.target);
}

main().catch(console.error);
