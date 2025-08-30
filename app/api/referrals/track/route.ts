import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { referralCode, visitorWalletAddress, visitorIP, userAgent } = await request.json();

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 });
    }

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    const usersCollection = db.collection("users");
    const referralVisitsCollection = db.collection("referral_visits");

    // Find the referrer by referral code
    const referrer = await usersCollection.findOne({ referralCode });

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    // Don't track self-referrals
    if (visitorWalletAddress && referrer.walletAddress === visitorWalletAddress) {
      return NextResponse.json({ message: "Self-referral not tracked" }, { status: 200 });
    }

    // Record the referral visit
    const visitRecord = {
      referralCode,
      referrerWalletAddress: referrer.walletAddress,
      visitorWalletAddress: visitorWalletAddress || null,
      visitorIP: visitorIP || null,
      userAgent: userAgent || null,
      timestamp: new Date().toISOString(),
      converted: false, // Will be updated when user actually signs up
    };

    await referralVisitsCollection.insertOne(visitRecord);

    // Update referrer's visit count
    await usersCollection.updateOne(
      { walletAddress: referrer.walletAddress },
      {
        $inc: { referralVisits: 1 },
        $set: { lastReferralVisit: new Date().toISOString() },
      },
    );

    return NextResponse.json({
      message: "Referral visit tracked successfully",
      referrer: {
        walletAddress: referrer.walletAddress,
      },
    });
  } catch (error) {
    console.error("Error tracking referral:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET endpoint to retrieve referral stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    const usersCollection = db.collection("users");
    const referralVisitsCollection = db.collection("referral_visits");

    const user = await usersCollection.findOne({ walletAddress });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get referral statistics
    const totalVisits = await referralVisitsCollection.countDocuments({
      referrerWalletAddress: walletAddress,
    });

    const totalConversions = await referralVisitsCollection.countDocuments({
      referrerWalletAddress: walletAddress,
      converted: true,
    });

    const recentVisits = await referralVisitsCollection
      .find({ referrerWalletAddress: walletAddress })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      referralCode: user.referralCode,
      referralLink: `https://bitsave.io/ref/${user.referralCode}`,
      stats: {
        totalVisits,
        totalConversions,
        conversionRate:
          totalVisits > 0 ? ((totalConversions / totalVisits) * 100).toFixed(2) : "0.00",
        totalRewards: user.totalReferralRewards || 0,
      },
      recentVisits: recentVisits.map((visit) => ({
        timestamp: visit.timestamp,
        visitorWalletAddress: visit.visitorWalletAddress,
        converted: visit.converted,
      })),
    });
  } catch (error) {
    console.error("Error getting referral stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
