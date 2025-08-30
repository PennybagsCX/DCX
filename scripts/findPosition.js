const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // DCX contract address
  const dcxAddress = "0xB287080120d6eA274dA0C1E1c8138003D4B5eB5F"; 

  // DC token address on Dogechain
  const dcTokenAddress = "0x7B4328c127B85369D9f82ca0503B000D09CF9180";

  // Dogeswap Factory on Dogechain
  const factoryAddress = "0xD27D9d61590874Bf9ee2c19c70E9E5ACDEE7D1c4";

  const factory = await ethers.getContractAt("IUniswapV2Factory", factoryAddress);

  // Get pair address
  const pairAddress = await factory.getPair(dcxAddress, dcTokenAddress);
  console.log("LP token address:", pairAddress);

  if (pairAddress !== ethers.ZeroAddress) {
    const pair = await ethers.getContractAt("ERC20", pairAddress);
    const balance = await pair.balanceOf(deployer.address);
    if (balance > 0) {
      console.log("LP token balance:", balance.toString());
    } else {
      console.log("No LP tokens found");
    }
  } else {
    console.log("Pair does not exist");
  }
}

main().catch(console.error);
