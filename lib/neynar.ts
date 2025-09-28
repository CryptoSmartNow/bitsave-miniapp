import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
import {
  SendFrameNotificationsReqBodyFilters,
  SendFrameNotificationsReqBodyNotification,
} from "@neynar/nodejs-sdk/build/api";

class Neynar {
  private client: NeynarAPIClient;

  constructor() {
    if (!process.env.NEYNAR_API_KEY) {
      throw new Error("Neynar API key is not set in environment variables.");
    }

    const config = new Configuration({
      apiKey: process.env.NEYNAR_API_KEY,
    });
    this.client = new NeynarAPIClient(config);
  }

  sendNotification(
    notification: SendFrameNotificationsReqBodyNotification,
    targetFids: number[] = [],
    filters: SendFrameNotificationsReqBodyFilters = {},
  ) {
    return this.client.publishFrameNotifications({
      notification,
      targetFids,
      filters,
    });
  }
}

export const neynarService = new Neynar();
