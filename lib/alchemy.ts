import { celo } from "viem/chains";

class Alchemy {
  BASE_URL = "https://dashboard.alchemy.com/api";
  API_TOKEN = process.env.ALCHEMY_API_TOKEN;
  WEBHOOK_IDS = {
    base: process.env.ALCHEMY_WALLET_ACTIVITY_WEBHOOK_ID_BASE!,
    celo: process.env.ALCHEMY_WALLET_ACTIVITY_WEBHOOK_ID_CELO!,
  };
  SUPPORTED_TOKENS = [
    'USDC',
    'CUSD',
    'cUSD',
    'USDGLO',
    '$G'
  ]

  constructor() {
    if (!this.API_TOKEN) {
      throw new Error("Alchemy API token is not set in environment variables.");
    }
  }

  async updateWebhookAddresses(
    webhook_id: string,
    addresses_to_add: string[],
    addresses_to_remove: string[],
  ) {
    const response = await fetch(`${this.BASE_URL}/update-webhook-addresses`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Alchemy-Token": this.API_TOKEN!,
      },
      body: JSON.stringify({
        webhook_id,
        addresses_to_add,
        addresses_to_remove,
      }),
    });

    return response;
  }
}

export const alchemyService = new Alchemy();
