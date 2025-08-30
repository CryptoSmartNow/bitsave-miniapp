# 💰 Bitsave — A Savings App for Farcaster Creators

Bitsave is a Farcaster MiniApp that helps creators automatically save a portion of their onchain earnings. Designed with creators in mind, it integrates directly with Farcaster’s wallet to detect incoming payments, suggest savings, and reward consistent savers. Think of it as your onchain savings assistant — simple, social, and secure.

## 🚀 Features

- 🏦 **Create a Savings Vault**
  - Define name, amount, network (Base/Celo), token, duration & penalty.
  - Optionally start with a $0 balance.

- 💸 **Top Up Your Vault**
  - Add funds manually to your plan at any time.

- 🔔 **Earnings-Based Notifications**
  - Automatic wallet monitoring.
  - Get prompts like: _"You earned $10 this week. Save 30% now?"_

- 📢 **Cast Your Save**
  - Share your savings as a public Farcaster cast: _"I just saved $10 on Bitsave!"_

- 🧠 **Smart Suggestions**
  - Bitsave suggests top-ups based on past activity and earning history.

- 🥇 **Savvy Leaderboard**
  - Track top savers on Farcaster by:
    - Total saved
    - $BTS rewards earned
    - Number of vaults
  - Filter by: All users / Friends / Base / Celo

- ⚙️ **Settings**
  - Enable/disable notifications
  - Auto-save (coming soon)

## 🔧 Tech Stack

- **Frontend:** V0 (React + Tailwind via prompts)
- **Blockchain:** Solidity smart contracts deployed on Base & Celo
- **Farcaster:** MiniApp SDK, Social Graph, Wallet integration
- **Backend:** (optional) for notifications, analytics & vault metadata

## 🧪 Local Development

```bash
git clone https://github.com/your-username/bitsave-miniapp.git
cd bitsave-miniapp
npm install
npm run dev
```

> Ensure you have a `.env` file configured with necessary API keys and contract addresses.

## ✨ Inspiration

Creators earn directly from casts, tips, and swaps on Farcaster — but many forget to save. Bitsave helps automate good habits and makes saving a social signal. Save with intention, and show it off.

## 📜 License

MIT © 2025 Bitsave
