require("dotenv").config();
const { WebSocketProvider, Contract, formatUnits } = require("ethers");
const axios = require("axios");

// Alchemy WebSocket URL for Base network
const ALCHEMY_WS_URL = process.env.ALCHEMY_WS_URL;

// Zo Token Contract Address and ABI
const ZO_TOKEN_ADDRESS = process.env.ZO_TOKEN_ADDRESS;
const TRANSFER_EVENT = "event Transfer(address indexed from, address indexed to, uint256 value)";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const provider = new WebSocketProvider(ALCHEMY_WS_URL);
const zoTokenContract = new Contract(ZO_TOKEN_ADDRESS, [TRANSFER_EVENT], provider);

async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
      await axios.post(url, {
        chat_id: CHAT_ID,
        text: message,
      });
      console.log("Message sent to Telegram!");
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
    }
  }
  
  // Listen for Transfer events
  zoTokenContract.on("Transfer", async (from, to, value) => {
    const amount = formatUnits(value, 6);
    const message = `
  🔄 Zo Token Transfer Detected:
  - From: ${from}
  - To: ${to}
  - Amount: ${amount} ZO
  `;
  
    console.log(message);
  
    // Send the message to Telegram
    await sendTelegramMessage(message);
  });

  console.log("Listening for Zo token transfers on Base network using Alchemy WebSocket...");
