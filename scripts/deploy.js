const { ethers } = require("hardhat");

async function main() {
  const DCX = await ethers.getContractFactory("DCX");
  const dcx = await DCX.deploy();

  await dcx.waitForDeployment();

  console.log("DCX deployed to:", dcx.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});