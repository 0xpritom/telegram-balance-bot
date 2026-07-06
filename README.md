# Multi-Chain Telegram Balance Bot 🚀

A simple, fast Telegram bot built with Node.js that instantly checks native token and stablecoin (USDC/USDT) balances across multiple blockchain networks.

## Supported Networks
- **Solana** (SOL, USDC, USDT)
- **Sui Network** (SUI, USDC)
- **Ethereum Mainnet** (ETH, USDC, USDT)
- **Binance Smart Chain** (BNB, USDC, USDT)
- **Polygon** (MATIC, USDC, USDT)

## Prerequisites
- **Node.js** (v18 or higher recommended)
- A **Telegram Bot Token** (obtainable from [@BotFather](https://t.me/botfather) on Telegram)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd telegram-balance-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(This will install `node-telegram-bot-api`, `ethers`, `@mysten/sui`, `@solana/web3.js`, and `dotenv`)*

3. **Configure Environment Variables:**
   - Copy the example `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Open the `.env` file and replace `your_bot_token_here` with your actual HTTP API token from BotFather.

4. **Run the Bot:**
   ```bash
   node index.js
   ```
   You should see the message: `🤖 Telegram Wallet Balance Bot is running...`

## Usage
1. Open Telegram and search for your bot.
2. Send `/start` to see the network selection menu.
3. Click a network (e.g., "Sui Network").
4. Reply with a valid wallet address.
5. The bot will fetch and display the balances for the selected network!
