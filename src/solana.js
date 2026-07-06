const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

async function getSolanaBalance(address) {
  try {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const pubKey = new PublicKey(address);
    const balance = await connection.getBalance(pubKey);
    const solBalance = balance / LAMPORTS_PER_SOL;
    
    let resultStr = `Native: ${solBalance} SOL`;

    // Fetch USDC
    try {
      const usdcAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, { mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') });
      let usdcBalance = 0;
      for (const account of usdcAccounts.value) {
        usdcBalance += account.account.data.parsed.info.tokenAmount.uiAmount;
      }
      resultStr += `\nUSDC: ${usdcBalance}`;
    } catch (e) {
      console.error('Error fetching USDC on Solana:', e.message);
    }

    // Fetch USDT
    try {
      const usdtAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, { mint: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB') });
      let usdtBalance = 0;
      for (const account of usdtAccounts.value) {
        usdtBalance += account.account.data.parsed.info.tokenAmount.uiAmount;
      }
      resultStr += `\nUSDT: ${usdtBalance}`;
    } catch (e) {
      console.error('Error fetching USDT on Solana:', e.message);
    }

    return resultStr;
  } catch (error) {
    console.error(`Error fetching Solana balance for ${address}:`, error);
    throw new Error('Failed to fetch balance. Ensure the address is a valid Solana public key.');
  }
}

module.exports = {
  getSolanaBalance,
};
