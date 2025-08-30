const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Replace with your deployed DCX contract address
  const dcxAddress = "0xB287080120d6eA274dA0C1E1c8138003D4B5eB5F"; 

  // DC token address on Dogechain
  const dcTokenAddress = "0x7B4328c127B85369D9f82ca0503B000D09CF9180";

  // Dogeswap Router on Dogechain
  const routerAddress = "0xa4EE06Ce40cb7e8c04E127c1F7D3D4D8F9C1D17D";

  // Dogeswap Factory on Dogechain
  const factoryAddress = "0xD27D9d61590874Bf9ee2c19c70E9E5ACDEE7D1c4";

  const dcx = await ethers.getContractAt("ERC20", dcxAddress);
  const dcToken = await ethers.getContractAt("ERC20", dcTokenAddress);
  const router = await ethers.getContractAt("IUniswapV2Router02", routerAddress);
  const factory = await ethers.getContractAt("IUniswapV2Factory", factoryAddress);

  // Amounts
  const amountDCX = ethers.parseEther("9999999999999999");
  const amountDC = ethers.parseEther("10");

  // Approve
  console.log("Approving DCX...");
  await dcx.approve(routerAddress, amountDCX);
  console.log("Approving DC token...");
  await dcToken.approve(routerAddress, amountDC);

  // Add liquidity
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  console.log("Adding liquidity...");
  const tx = await router.addLiquidity(
    dcxAddress,
    dcTokenAddress,
    amountDCX,
    amountDC,
    0, // amountAMin
    0, // amountBMin
    deployer.address,
    deadline
  );

  const receipt = await tx.wait();

  // Get LP token address
  const pairAddress = await factory.getPair(dcxAddress, dcTokenAddress);
  console.log("LP token address:", pairAddress);

  // Find the Transfer event for LP tokens
  const event = receipt.logs.find(log => 
    log.address === pairAddress && 
    log.topics[0] === ethers.id("Transfer(address,address,uint256)") &&
    log.topics[2] === deployer.address.padStart(66, '0x').toLowerCase() // to address
  );
  if (event) {
    const lpAmount = ethers.BigNumber.from(event.data);
    console.log("LP tokens received:", lpAmount.toString());
  } else {
    console.log("LP tokens added, but could not find transfer event.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
