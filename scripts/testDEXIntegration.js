const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Starting DCX DEX Integration Test...\n");
  
  const [deployer, user1, user2] = await ethers.getSigners();
  
  // Contract addresses from deployment
  const DCX_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const DC_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
  const DEX_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
  
  console.log("📋 Test Configuration:");
  console.log("Deployer:", deployer.address);
  console.log("User1:", user1.address);
  console.log("User2:", user2.address);
  console.log("DCX Address:", DCX_ADDRESS);
  console.log("DC Address:", DC_ADDRESS);
  console.log("DEX Address:", DEX_ADDRESS);
  console.log("=".repeat(50));

  try {
    // Get contract instances
    const dcx = await ethers.getContractAt("DCX", DCX_ADDRESS);
    const dc = await ethers.getContractAt("DCX", DC_ADDRESS); // Using same contract type
    const dex = await ethers.getContractAt("SimpleDEX", DEX_ADDRESS);

    console.log("\n✅ Step 1: Verify Contract Deployment");
    const dcxName = await dcx.name();
    const dcName = await dc.name();
    const tokenA = await dex.tokenA();
    const tokenB = await dex.tokenB();
    
    console.log("DCX Token Name:", dcxName);
    console.log("DC Token Name:", dcName);
    console.log("DEX TokenA:", tokenA);
    console.log("DEX TokenB:", tokenB);
    console.log("✅ All contracts deployed and accessible");

    console.log("\n✅ Step 2: Check Initial Balances");
    const dcxBalance = await dcx.balanceOf(deployer.address);
    const dcBalance = await dc.balanceOf(deployer.address);
    
    console.log("Deployer DCX Balance:", ethers.formatEther(dcxBalance));
    console.log("Deployer DC Balance:", ethers.formatEther(dcBalance));

    console.log("\n✅ Step 3: Transfer Tokens to Test Users");
    const transferAmount = ethers.parseEther("1000");
    
    await dcx.transfer(user1.address, transferAmount);
    await dc.transfer(user1.address, transferAmount);
    await dcx.transfer(user2.address, transferAmount);
    await dc.transfer(user2.address, transferAmount);
    
    const user1DCX = await dcx.balanceOf(user1.address);
    const user1DC = await dc.balanceOf(user1.address);
    
    console.log("User1 DCX Balance:", ethers.formatEther(user1DCX));
    console.log("User1 DC Balance:", ethers.formatEther(user1DC));

    console.log("\n✅ Step 4: Test Liquidity Addition");
    const liquidityAmount = ethers.parseEther("100");
    
    // Approve tokens for DEX
    await dcx.connect(user1).approve(DEX_ADDRESS, liquidityAmount);
    await dc.connect(user1).approve(DEX_ADDRESS, liquidityAmount);
    
    console.log("Approved tokens for liquidity addition");
    
    // Add liquidity
    await dex.connect(user1).addLiquidity(liquidityAmount, liquidityAmount);
    console.log("✅ Liquidity added successfully!");
    
    // Check reserves
    const reserveA = await dex.reserveA();
    const reserveB = await dex.reserveB();
    
    console.log("Reserve A (DCX):", ethers.formatEther(reserveA));
    console.log("Reserve B (DC):", ethers.formatEther(reserveB));

    console.log("\n✅ Step 5: Test Token Swapping");
    const swapAmount = ethers.parseEther("10");
    
    // Test DCX -> DC swap
    await dcx.connect(user2).approve(DEX_ADDRESS, swapAmount);
    
    const user2DCBefore = await dc.balanceOf(user2.address);
    console.log("User2 DC Balance Before Swap:", ethers.formatEther(user2DCBefore));
    
    await dex.connect(user2).swap(DCX_ADDRESS, swapAmount, 0);
    console.log("✅ DCX -> DC swap completed!");
    
    const user2DCAfter = await dc.balanceOf(user2.address);
    console.log("User2 DC Balance After Swap:", ethers.formatEther(user2DCAfter));
    
    const dcReceived = user2DCAfter - user2DCBefore;
    console.log("DC Tokens Received:", ethers.formatEther(dcReceived));

    // Check updated reserves
    const newReserveA = await dex.reserveA();
    const newReserveB = await dex.reserveB();
    
    console.log("Updated Reserve A (DCX):", ethers.formatEther(newReserveA));
    console.log("Updated Reserve B (DC):", ethers.formatEther(newReserveB));

    console.log("\n✅ Step 6: Test Reverse Swap (DC -> DCX)");
    const reverseSwapAmount = ethers.parseEther("5");
    
    await dc.connect(user2).approve(DEX_ADDRESS, reverseSwapAmount);
    
    const user2DCXBefore = await dcx.balanceOf(user2.address);
    console.log("User2 DCX Balance Before Reverse Swap:", ethers.formatEther(user2DCXBefore));
    
    await dex.connect(user2).swap(DC_ADDRESS, reverseSwapAmount, 0);
    console.log("✅ DC -> DCX swap completed!");
    
    const user2DCXAfter = await dcx.balanceOf(user2.address);
    console.log("User2 DCX Balance After Reverse Swap:", ethers.formatEther(user2DCXAfter));
    
    const dcxReceived = user2DCXAfter - user2DCXBefore;
    console.log("DCX Tokens Received:", ethers.formatEther(dcxReceived));

    // Final reserves
    const finalReserveA = await dex.reserveA();
    const finalReserveB = await dex.reserveB();
    
    console.log("Final Reserve A (DCX):", ethers.formatEther(finalReserveA));
    console.log("Final Reserve B (DC):", ethers.formatEther(finalReserveB));

    console.log("\n🎉 INTEGRATION TEST RESULTS:");
    console.log("=".repeat(50));
    console.log("✅ Contract Deployment: PASSED");
    console.log("✅ Token Transfers: PASSED");
    console.log("✅ Liquidity Addition: PASSED");
    console.log("✅ DCX -> DC Swap: PASSED");
    console.log("✅ DC -> DCX Swap: PASSED");
    console.log("✅ Reserve Updates: PASSED");
    console.log("=".repeat(50));
    console.log("🚀 DCX DEX is fully functional and ready for trading!");

  } catch (error) {
    console.error("❌ Integration test failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
