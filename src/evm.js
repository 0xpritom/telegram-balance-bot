const { ethers } = require('ethers');

const EVM_NETWORKS = {
  ethereum: {
    name: 'Ethereum Mainnet',
    rpc: 'https://cloudflare-eth.com',
    symbol: 'ETH',
    tokens: {
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    }
  },
  bsc: {
    name: 'Binance Smart Chain',
    rpc: 'https://bsc-dataseed.binance.org',
    symbol: 'BNB',
    tokens: {
      USDT: '0x55d398326f99059fF775485246999027B3197955',
      USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
    }
  },
  polygon: {
    name: 'Polygon',
    rpc: 'https://polygon-rpc.com',
    symbol: 'MATIC',
    tokens: {
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
    }
  }
};

const erc20Abi = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

async function getEVMBalance(networkKey, address) {
  const network = EVM_NETWORKS[networkKey];
  if (!network) {
    throw new Error('Unsupported network');
  }

  try {
    const provider = new ethers.JsonRpcProvider(network.rpc);
    
    // Fetch native balance
    const balanceWei = await provider.getBalance(address);
    const balance = ethers.formatEther(balanceWei);
    
    let resultStr = `Native: ${balance} ${network.symbol}`;
    
    // Fetch token balances if defined
    if (network.tokens) {
      for (const [tokenSymbol, tokenAddress] of Object.entries(network.tokens)) {
        try {
          const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
          const tokenBalanceRaw = await contract.balanceOf(address);
          const decimals = await contract.decimals();
          const tokenBalance = ethers.formatUnits(tokenBalanceRaw, decimals);
          resultStr += `\n${tokenSymbol}: ${tokenBalance}`;
        } catch (e) {
          console.error(`Error fetching ${tokenSymbol} on ${networkKey}:`, e.message);
        }
      }
    }
    
    return resultStr;
  } catch (error) {
    console.error(`Error fetching EVM balance for ${address} on ${networkKey}:`, error);
    throw new Error('Failed to fetch balance. Ensure the address is valid.');
  }
}

module.exports = {
  EVM_NETWORKS,
  getEVMBalance,
};
