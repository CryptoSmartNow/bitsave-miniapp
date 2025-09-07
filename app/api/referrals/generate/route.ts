import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  return NextResponse.json({
    referralCode: "referralCode",
    referralLink: `https://bitsave.io/ref/{referralCode}`,
    isNew: false,
  });

  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // TypeScript assertion - we know db is not null after the check above
    const usersCollection = db!.collection("users");

    // Check if user already exists
    const user = await usersCollection.findOne({ walletAddress });

    // Check if user exists and has a referral code
    if (user && (user as any).referralCode) {
      // User already has a referral code
      return NextResponse.json({
        referralCode: (user as any).referralCode,
        referralLink: `https://bitsave.io/ref/${(user as any).referralCode}`,
        isNew: false,
      });
    }

    // Generate unique referral code
    let referralCode;
    let isUnique = false;

    while (!isUnique) {
      referralCode = nanoid(8); // Generate 8-character code
      const existingUser = await usersCollection.findOne({ referralCode });
      if (!existingUser) {
        isUnique = true;
      }
    }

    // Update or create user with referral code
    await usersCollection.updateOne(
      { walletAddress },
      {
        $set: {
          referralCode,
          updatedAt: new Date().toISOString(),
        },
        $setOnInsert: {
          walletAddress,
          createdAt: new Date().toISOString(),
          referralCount: 0,
          totalReferralRewards: 0,
        },
      },
      { upsert: true },
    );

    return NextResponse.json({
      referralCode,
      referralLink: `https://bitsave.io/ref/${referralCode}`,
      isNew: !user,
    });
  } catch (error) {
    console.error("Error generating referral code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
