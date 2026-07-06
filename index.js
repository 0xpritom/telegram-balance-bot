require('dotenv').config();
const TelegramBotModule = require('node-telegram-bot-api');
const TelegramBot = TelegramBotModule.default || TelegramBotModule;
const { EVM_NETWORKS, getEVMBalance } = require('./src/evm');
const { getSuiBalance } = require('./src/sui');
const { getSolanaBalance } = require('./src/solana');

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("Please provide TELEGRAM_BOT_TOKEN in your .env file!");
  process.exit(1);
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Simple in-memory store for user states. 
// In a production app, you might want to use a database (like Redis/MongoDB).
const userStates = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  // Reset user state
  userStates[chatId] = { network: null };

  const keyboard = [
    [{ text: 'Sui Network', callback_data: 'network_sui' }],
    [{ text: 'Solana', callback_data: 'network_solana' }],
    [{ text: 'Ethereum Mainnet', callback_data: 'network_ethereum' }],
    [{ text: 'Binance Smart Chain', callback_data: 'network_bsc' }],
    [{ text: 'Polygon', callback_data: 'network_polygon' }],
  ];

  bot.sendMessage(chatId, 'Welcome! Please select the network you want to check a balance on:', {
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
});

// Handle callback queries from the inline keyboard
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data.startsWith('network_')) {
    const network = data.replace('network_', '');
    userStates[chatId] = { network };
    
    let networkName = 'Unknown';
    if (network === 'sui') {
      networkName = 'Sui Network';
    } else if (network === 'solana') {
      networkName = 'Solana';
    } else if (EVM_NETWORKS[network]) {
      networkName = EVM_NETWORKS[network].name;
    }

    bot.sendMessage(chatId, `You selected **${networkName}**.\n\nPlease send me the wallet address to check its balance:`, { parse_mode: 'Markdown' });
    
    // Always answer the callback query to remove the loading state on the button
    bot.answerCallbackQuery(query.id);
  }
});

// Listen for any kind of message
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  
  // Ignore commands like /start
  if (!msg.text || msg.text.startsWith('/')) return;

  const state = userStates[chatId];
  if (!state || !state.network) {
    bot.sendMessage(chatId, 'Please use /start to select a network first.');
    return;
  }

  const address = msg.text.trim();
  bot.sendMessage(chatId, '⏳ Fetching balance...');

  try {
    let balanceStr;
    if (state.network === 'sui') {
      balanceStr = await getSuiBalance(address);
    } else if (state.network === 'solana') {
      balanceStr = await getSolanaBalance(address);
    } else {
      balanceStr = await getEVMBalance(state.network, address);
    }

    bot.sendMessage(chatId, `💰 Balance for \`${address}\`:\n\n**${balanceStr}**`, { parse_mode: 'Markdown' });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Error: ${error.message}`);
  }
});

console.log("🤖 Telegram Wallet Balance Bot is running...");
