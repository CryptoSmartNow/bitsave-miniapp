import { NextResponse } from "next/server";
import { alchemyService } from "@/lib/alchemy";
import { userDatabase } from "@/lib/mongodb";
import { neynarService } from "@/lib/neynar";
import {
  SendFrameNotificationsReqBodyNotification,
  SendFrameNotificationsResponse,
} from "@neynar/nodejs-sdk/build/api";
import { v5 as uuidv5 } from "uuid";

export async function POST(request: Request) {
  console.log("Received wallet activity webhook");
  console.log("payload", JSON.stringify(await request.json()));

  // make sure webhook id is valid
  const { webhookId } = await request.json();
  const webhookIds = Object.values(alchemyService.WEBHOOK_IDS);
  if (!webhookId || !webhookIds.includes(webhookId)) {
    return NextResponse.json({ status: "error", message: "Invalid webhook ID" }, { status: 400 });
  }

  // find which chain the webhook is for
  const chain = Object.entries(alchemyService.WEBHOOK_IDS).find(([, id]) => id === webhookId)?.[0];

  console.log("chain", chain);

  const transactions = (await request.json()).event.activity;

  for (const tx of transactions) {
    console.log(`[${chain}] New transaction: ${tx.hash}`);

    const asset = tx.asset;
    const amount = tx.value;
    const to = tx.to;

    // we only care about incoming transactions with amount > 10
    if (amount < 10) continue;

    // check if asset is supported
    if (!alchemyService.SUPPORTED_TOKENS.includes(asset.symbol)) {
      console.log(`Asset ${asset.symbol} is not supported`);
      continue;
    }

    // find user with to address
    const user = await userDatabase.getUserByWallet(to);

    if (!user) {
      console.log(`No user found with wallet address ${to}`);
      continue;
    }

    const fid = user.fid;

    console.log(
      `User ${fid} received ${amount} ${asset.symbol} on ${chain} in transaction ${tx.hash}`,
    );

    // send notification to user
    const notification: SendFrameNotificationsReqBodyNotification = {
      body: `You received ${amount} ${asset.symbol}. Save 30% of it for later on Bitsave!`,
      title: "Incoming Transaction",
      target_url: "https://bitsave-miniapp.vercel.app/dashboard/create-savings",
      uuid: uuidv5(tx.hash, uuidv5.DNS)
    };
    const notificationResponse: SendFrameNotificationsResponse =
      await neynarService.sendNotification(notification, [Number(fid)]);
    const notificationDelivery = notificationResponse.notification_deliveries?.[0];
    if (notificationDelivery?.status !== "success") {
      // remove user from db and unregister webhooks
      console.log(`Failed to send notification to user ${fid}. Removing user.`);
      await userDatabase.deleteUserByFid(fid);
      await alchemyService.updateWebhookAddresses(webhookId, [], [user.walletAddress]);
    }
  }

  return NextResponse.json({ status: "ok" });
}
