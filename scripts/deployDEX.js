const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy Factory
  const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.deploy(deployer.address);
  await factory.waitForDeployment();
  console.log("Factory deployed at:", factory.target);

  // WDOGE address on Dogechain
  const wDogeAddress = "0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101";

  // Deploy Router
  const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
  const router = await UniswapV2Router02.deploy(factory.target, wDogeAddress);
  await router.waitForDeployment();
  console.log("Router deployed at:", router.target);
}

main().catch(console.error);
