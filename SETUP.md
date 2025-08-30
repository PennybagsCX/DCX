# 🚀 DCX DEX Setup Guide

This guide will help you set up the DCX DEX for local development and testing.

## 🔧 Quick Fix for Current Error

The error you're experiencing is because the smart contracts are not deployed at the addresses specified in the frontend. Here's how to fix it:

### Option 1: Local Development (Recommended)

1. **Start a local Hardhat network:**
   ```bash
   npx hardhat node
   ```
   This will start a local blockchain at `http://127.0.0.1:8545`

2. **Deploy contracts locally:**
   ```bash
   npx hardhat run scripts/deployLocal.js --network localhost
   ```
   This will output the deployed contract addresses.

3. **Update frontend addresses:**
   Copy the addresses from the deployment output and update `app/page.js`:
   ```javascript
   const DEX_ADDRESS = 'YOUR_DEX_ADDRESS_HERE';
   const DCX_ADDRESS = 'YOUR_DCX_ADDRESS_HERE';
   const DC_ADDRESS = 'YOUR_DC_ADDRESS_HERE';
   ```

4. **Configure MetaMask:**
   - Add localhost network to MetaMask:
     - Network Name: Localhost 8545
     - RPC URL: http://127.0.0.1:8545
     - Chain ID: 1337
     - Currency Symbol: ETH
   
   - Import a test account using one of the private keys from the Hardhat node output

5. **Start the frontend:**
   ```bash
   npm run dev
   ```

### Option 2: Deploy to Dogechain

If you want to deploy to the actual Dogechain network:

1. **Make sure you have DOGE tokens** in your wallet for gas fees

2. **Deploy DCX token:**
   ```bash
   npx hardhat run scripts/deploy.js --network dogechain
   ```

3. **Deploy SimpleDEX:**
   ```bash
   npx hardhat run scripts/deploySimpleDEX.js --network dogechain
   ```

4. **Update frontend with the deployed addresses**

5. **Add initial liquidity:**
   ```bash
   npx hardhat run scripts/addLiquidityToDEX.js --network dogechain
   ```

## 🐛 Troubleshooting

### Error: "execution reverted (unknown custom error)"

This error occurs when:
- ✅ **Fixed**: Contracts not deployed at specified addresses
- ✅ **Fixed**: No liquidity in the DEX pool
- ✅ **Fixed**: Insufficient token balances
- ✅ **Fixed**: Wrong network selected in MetaMask

### Error: "Smart contracts not deployed"

- Make sure you've deployed the contracts using the deployment scripts
- Verify you're connected to the correct network
- Check that the contract addresses in the frontend match the deployed addresses

### Error: "No liquidity available"

- The DEX needs initial liquidity to function
- Use the `addLiquidityToDEX.js` script to add initial liquidity
- Or add liquidity through the frontend interface

### Error: "Insufficient balance"

- Make sure you have DCX and DC tokens in your wallet
- For local testing, the deployment script gives you test tokens
- For mainnet, you need to acquire the tokens first

## 📝 Development Workflow

1. **Start local blockchain:** `npx hardhat node`
2. **Deploy contracts:** `npx hardhat run scripts/deployLocal.js --network localhost`
3. **Update frontend addresses** in `app/page.js`
4. **Start frontend:** `npm run dev`
5. **Configure MetaMask** for localhost network
6. **Import test account** from Hardhat node
7. **Test the DEX functionality**

## 🧪 Testing

Run the test suite to verify everything works:
```bash
npm test
```

All tests should pass before deployment.

## 🔒 Security Notes

- Never commit your `.env` file with real private keys
- Use test networks for development
- Audit smart contracts before mainnet deployment
- Always test thoroughly before using real funds

## 📞 Support

If you continue to experience issues:
1. Check that all steps above are completed
2. Verify MetaMask is connected to the correct network
3. Ensure contract addresses match between deployment and frontend
4. Check browser console for additional error details

The improved error handling in the frontend will now provide more specific error messages to help diagnose issues.
