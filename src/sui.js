const { SuiClient, getFullnodeUrl } = require('@mysten/sui/client');

async function getSuiBalance(address) {
  // We use the public mainnet fullnode
  const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

  try {
    const balanceInfo = await client.getBalance({ owner: address });
    const suiBalance = Number(balanceInfo.totalBalance) / 1000000000;
    
    let resultStr = `Native: ${suiBalance} SUI`;
    
    // Fetch USDC balance (Native USDC on Sui)
    const USDC_COIN_TYPE = '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC';
    try {
      const usdcBalanceInfo = await client.getBalance({ owner: address, coinType: USDC_COIN_TYPE });
      // USDC on Sui has 6 decimals
      const usdcBalance = Number(usdcBalanceInfo.totalBalance) / 1000000;
      resultStr += `\nUSDC: ${usdcBalance}`;
    } catch (e) {
      console.error(`Error fetching USDC balance on Sui for ${address}:`, e.message);
    }

    return resultStr;
  } catch (error) {
    console.error(`Error fetching SUI balance for ${address}:`, error);
    throw new Error('Failed to fetch balance. Ensure the address is valid.');
  }
}

module.exports = {
  getSuiBalance,
};
