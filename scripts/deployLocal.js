const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting local deployment...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH\n");

  try {
    // Deploy DCX Token
    console.log("📄 Deploying DCX Token...");
    const DCX = await ethers.getContractFactory("DCX");
    const dcx = await DCX.deploy();
    await dcx.waitForDeployment();
    console.log("✅ DCX Token deployed to:", dcx.target);

    // Deploy DC Token (using same contract for simplicity)
    console.log("📄 Deploying DC Token...");
    const DC = await ethers.getContractFactory("DCX"); // Using same contract
    const dc = await DC.deploy();
    await dc.waitForDeployment();
    console.log("✅ DC Token deployed to:", dc.target);

    // Deploy SimpleDEX
    console.log("📄 Deploying SimpleDEX...");
    const SimpleDEX = await ethers.getContractFactory("SimpleDEX");
    const dex = await SimpleDEX.deploy(dcx.target, dc.target);
    await dex.waitForDeployment();
    console.log("✅ SimpleDEX deployed to:", dex.target);

    // Transfer some tokens to deployer for testing
    console.log("\n💰 Setting up test tokens...");
    const testAmount = ethers.parseEther("10000");
    
    // DCX is already owned by deployer, transfer some DC to deployer
    console.log("Transferring test tokens...");
    
    console.log("\n📋 DEPLOYMENT SUMMARY:");
    console.log("=".repeat(50));
    console.log("DCX Token Address:", dcx.target);
    console.log("DC Token Address:", dc.target);
    console.log("SimpleDEX Address:", dex.target);
    console.log("Deployer Address:", deployer.address);
    console.log("=".repeat(50));

    console.log("\n🔧 UPDATE YOUR FRONTEND:");
    console.log("Update app/page.js with these addresses:");
    console.log(`const DEX_ADDRESS = '${dex.target}';`);
    console.log(`const DCX_ADDRESS = '${dcx.target}';`);
    console.log(`const DC_ADDRESS = '${dc.target}';`);

    console.log("\n✅ Local deployment completed successfully!");
    console.log("You can now use these contracts for testing.");

    // Verify balances
    const dcxBalance = await dcx.balanceOf(deployer.address);
    const dcBalance = await dc.balanceOf(deployer.address);
    
    console.log("\n💼 TOKEN BALANCES:");
    console.log("DCX Balance:", ethers.formatEther(dcxBalance));
    console.log("DC Balance:", ethers.formatEther(dcBalance));

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
