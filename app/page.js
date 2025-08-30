'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const DEX_ADDRESS = '0x56DEB47AC4403D48d7111B6365cd1866B01f8d13';
const DCX_ADDRESS = '0xB287080120d6eA274dA0C1E1c8138003D4B5eB5F';
const DC_ADDRESS = '0x7B4328c127B85369D9f82ca0503B000D09CF9180';

const DEX_ABI = [
  "function addLiquidity(uint256 amountA, uint256 amountB) external",
  "function swap(address tokenIn, uint256 amountIn, uint256 minAmountOut) external",
  "function tokenA() view returns (address)",
  "function tokenB() view returns (address)",
  "function reserveA() view returns (uint256)",
  "function reserveB() view returns (uint256)"
];

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address, uint256) returns (bool)",
  "function transfer(address, uint256) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [dex, setDex] = useState(null);
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balances, setBalances] = useState({ dcx: '0', dc: '0' });
  const [reserves, setReserves] = useState({ reserveA: '0', reserveB: '0' });
  const [liquidityAmounts, setLiquidityAmounts] = useState({ amountA: '', amountB: '' });
  const [swapAmounts, setSwapAmounts] = useState({ amountIn: '', tokenIn: DCX_ADDRESS });

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const dex = new ethers.Contract(DEX_ADDRESS, DEX_ABI, signer);

      setProvider(provider);
      setSigner(signer);
      setDex(dex);
      setAccount(address);
      setSuccess('Wallet connected successfully!');

      // Load initial data
      await loadBalances(address, provider);
      await loadReserves(dex);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBalances = async (address, providerInstance) => {
    try {
      const dcxContract = new ethers.Contract(DCX_ADDRESS, ERC20_ABI, providerInstance || provider);
      const dcContract = new ethers.Contract(DC_ADDRESS, ERC20_ABI, providerInstance || provider);

      const dcxBalance = await dcxContract.balanceOf(address);
      const dcBalance = await dcContract.balanceOf(address);

      setBalances({
        dcx: ethers.formatEther(dcxBalance),
        dc: ethers.formatEther(dcBalance)
      });
    } catch (err) {
      console.error('Error loading balances:', err);
    }
  };

  const loadReserves = async (dexContract) => {
    try {
      const reserveA = await dexContract.reserveA();
      const reserveB = await dexContract.reserveB();

      setReserves({
        reserveA: ethers.formatEther(reserveA),
        reserveB: ethers.formatEther(reserveB)
      });
    } catch (err) {
      console.error('Error loading reserves:', err);
    }
  };

  const addLiquidity = async () => {
    if (!dex || !liquidityAmounts.amountA || !liquidityAmounts.amountB) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const amountA = ethers.parseEther(liquidityAmounts.amountA);
      const amountB = ethers.parseEther(liquidityAmounts.amountB);

      // Approve tokens first
      const dcxContract = new ethers.Contract(DCX_ADDRESS, ERC20_ABI, signer);
      const dcContract = new ethers.Contract(DC_ADDRESS, ERC20_ABI, signer);

      setSuccess('Approving DCX tokens...');
      await dcxContract.approve(DEX_ADDRESS, amountA);

      setSuccess('Approving DC tokens...');
      await dcContract.approve(DEX_ADDRESS, amountB);

      setSuccess('Adding liquidity...');
      const tx = await dex.addLiquidity(amountA, amountB);
      await tx.wait();

      setSuccess('Liquidity added successfully!');
      setLiquidityAmounts({ amountA: '', amountB: '' });

      // Refresh data
      await loadBalances(account, provider);
      await loadReserves(dex);
    } catch (error) {
      console.error(error);
      setError(error.message || 'Error adding liquidity');
    } finally {
      setLoading(false);
    }
  };

  const swap = async () => {
    if (!dex || !swapAmounts.amountIn) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const amountIn = ethers.parseEther(swapAmounts.amountIn);
      const tokenContract = new ethers.Contract(swapAmounts.tokenIn, ERC20_ABI, signer);

      setSuccess('Approving tokens...');
      await tokenContract.approve(DEX_ADDRESS, amountIn);

      setSuccess('Executing swap...');
      const tx = await dex.swap(swapAmounts.tokenIn, amountIn, 0);
      await tx.wait();

      setSuccess('Swap completed successfully!');
      setSwapAmounts({ ...swapAmounts, amountIn: '' });

      // Refresh data
      await loadBalances(account, provider);
      await loadReserves(dex);
    } catch (error) {
      console.error(error);
      setError(error.message || 'Error executing swap');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-connect if wallet was previously connected
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">DCX DEX</h1>
          <p className="text-gray-300">Decentralized Exchange for DCX and DC Tokens</p>
        </div>

        {/* Wallet Connection */}
        {!signer ? (
          <div className="max-w-md mx-auto card p-6">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">Connect Your Wallet</h2>
            <button
              onClick={connectWallet}
              disabled={loading}
              className="w-full btn btn-primary py-3 px-6"
            >
              {loading ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Account Info */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-300 text-sm">Connected Account</p>
                  <p className="text-white font-mono text-sm">{account.slice(0, 6)}...{account.slice(-4)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-sm">DCX Balance</p>
                  <p className="text-white font-semibold">{parseFloat(balances.dcx).toFixed(4)} DCX</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-sm">DC Balance</p>
                  <p className="text-white font-semibold">{parseFloat(balances.dc).toFixed(4)} DC</p>
                </div>
              </div>
            </div>

            {/* Pool Information */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Pool Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-gray-300 text-sm">DCX Reserve</p>
                  <p className="text-white font-semibold">{parseFloat(reserves.reserveA).toFixed(4)} DCX</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-sm">DC Reserve</p>
                  <p className="text-white font-semibold">{parseFloat(reserves.reserveB).toFixed(4)} DC</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            {(error || success) && (
              <div className={`alert ${error ? 'alert-error' : 'alert-success'}`}>
                <div className="flex justify-between items-center">
                  <p>
                    {error || success}
                  </p>
                  <button
                    onClick={clearMessages}
                    className="text-white"
                    style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Liquidity */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Add Liquidity</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">DCX Amount</label>
                    <input
                      type="number"
                      value={liquidityAmounts.amountA}
                      onChange={(e) => setLiquidityAmounts({...liquidityAmounts, amountA: e.target.value})}
                      placeholder="0.0"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">DC Amount</label>
                    <input
                      type="number"
                      value={liquidityAmounts.amountB}
                      onChange={(e) => setLiquidityAmounts({...liquidityAmounts, amountB: e.target.value})}
                      placeholder="0.0"
                      className="form-input"
                    />
                  </div>
                  <button
                    onClick={addLiquidity}
                    disabled={loading || !liquidityAmounts.amountA || !liquidityAmounts.amountB}
                    className="w-full btn btn-success py-3 px-6"
                  >
                    {loading ? 'Processing...' : 'Add Liquidity'}
                  </button>
                </div>
              </div>

              {/* Swap */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Swap Tokens</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">From Token</label>
                    <select
                      value={swapAmounts.tokenIn}
                      onChange={(e) => setSwapAmounts({...swapAmounts, tokenIn: e.target.value})}
                      className="form-select"
                    >
                      <option value={DCX_ADDRESS}>DCX</option>
                      <option value={DC_ADDRESS}>DC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Amount</label>
                    <input
                      type="number"
                      value={swapAmounts.amountIn}
                      onChange={(e) => setSwapAmounts({...swapAmounts, amountIn: e.target.value})}
                      placeholder="0.0"
                      className="form-input"
                    />
                  </div>
                  <button
                    onClick={swap}
                    disabled={loading || !swapAmounts.amountIn}
                    className="w-full btn btn-purple py-3 px-6"
                  >
                    {loading ? 'Processing...' : 'Swap'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
