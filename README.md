# DCX DEX - Decentralized Exchange

A modern, responsive decentralized exchange (DEX) built for trading DCX and DC tokens. This project combines Solidity smart contracts with a Next.js frontend to provide a seamless DeFi trading experience.

## 🚀 Features

- **Smart Contract DEX**: Simple yet effective automated market maker (AMM) for token swapping
- **Liquidity Provision**: Add liquidity to earn from trading fees
- **Modern UI**: Responsive design that works on desktop and mobile devices
- **Wallet Integration**: Connect with MetaMask and other Web3 wallets
- **Real-time Updates**: Live balance and reserve information
- **Comprehensive Testing**: Full test coverage for smart contracts

## 🏗️ Architecture

### Smart Contracts

- **DCX Token**: ERC-20 token contract with standard functionality
- **SimpleDEX**: Automated market maker contract for DCX/DC token pairs
- **Interfaces**: Uniswap V2 compatible interfaces for future expansion

### Frontend

- **Next.js 15**: Modern React framework with App Router
- **Custom CSS**: Responsive design with glass morphism effects
- **Ethers.js**: Web3 integration for blockchain interactions
- **Real-time Data**: Live updates of balances and pool reserves

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PennybagsCX/DCX.git
   cd DCX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Compile smart contracts**
   ```bash
   npm run compile
   ```

5. **Run tests**
   ```bash
   npm test
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_private_key_here
DOGECHAIN_RPC_URL=https://rpc.dogechain.dog
```

**⚠️ Security Note**: Never commit your `.env` file to version control. The `.gitignore` file is configured to exclude it.

### Network Configuration

The project is configured for Dogechain network. To deploy to other networks, update `hardhat.config.js`:

```javascript
networks: {
  your_network: {
    url: "YOUR_RPC_URL",
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

## 🚀 Deployment

### Smart Contracts

1. **Deploy DCX Token**
   ```bash
   npx hardhat run scripts/deploy.js --network dogechain
   ```

2. **Deploy SimpleDEX**
   ```bash
   npx hardhat run scripts/deploySimpleDEX.js --network dogechain
   ```

3. **Add Initial Liquidity**
   ```bash
   npx hardhat run scripts/addLiquidityToDEX.js --network dogechain
   ```

### Frontend

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🧪 Testing

### Smart Contract Tests

Run the comprehensive test suite:

```bash
npm test
```

Test coverage includes:
- Token deployment and basic functionality
- DEX liquidity addition and removal
- Token swapping mechanics
- Error handling and edge cases

### Frontend Testing

The frontend has been tested with:
- ✅ Wallet connection functionality
- ✅ Responsive design across devices
- ✅ Real-time data updates
- ✅ Error handling and user feedback

## 📱 Usage

### For Users

1. **Connect Wallet**: Click "Connect MetaMask" to link your wallet
2. **Add Liquidity**: Provide equal value of DCX and DC tokens to earn fees
3. **Swap Tokens**: Exchange DCX for DC or vice versa
4. **Monitor Pools**: View real-time reserve information

### For Developers

1. **Smart Contract Integration**: Use the provided ABIs to integrate with other dApps
2. **Frontend Customization**: Modify the CSS and React components as needed
3. **Network Expansion**: Add support for additional networks in the configuration

## 🔒 Security

- Private keys and sensitive data are excluded from version control
- Smart contracts follow OpenZeppelin standards
- Comprehensive input validation and error handling
- Regular security audits recommended for production use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the test files for usage examples

## 🔗 Links

- [GitHub Repository](https://github.com/PennybagsCX/DCX)
- [Dogechain Network](https://dogechain.dog/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)

---

**Built with ❤️ for the DeFi community**
