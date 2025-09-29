import { type User } from "@/types";
import { userDatabase as userDb, connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { alchemyService } from "@/lib/alchemy";
import { isAddress } from "ethers";

export async function POST(request: Request) {
  const body: User = await request.json();
  const { fid, walletAddress } = body;

  // validate the wallet address is an evm wallet
  if (!isAddress(walletAddress)) {
    return NextResponse.json({ message: "Invalid wallet address" }, { status: 400 });
  }

  // Check if user already exists
  const existingUser = await userDb.getUserByWallet(walletAddress);

  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 409 });
  }

  // Create new user
  const newUser = await userDb.createUser(fid, walletAddress);

  // register them for wallet activity webhooks here
  const addRequests: Promise<Response>[] = [];
  Object.entries(alchemyService.WEBHOOK_IDS).forEach(async ([key, webhookId]) => {
    webhookId &&
      addRequests.push(alchemyService.updateWebhookAddresses(webhookId, [walletAddress], []));
  });

  const responses = await Promise.all(addRequests);

  responses.forEach(async (res) => {
    console.log("registered wallet for webhook:", await res.text());
    if (!res.ok) {
      console.error("Failed to register wallet for webhook:", res.statusText);
    }
  });

  return NextResponse.json(newUser, { status: 201 });
}
