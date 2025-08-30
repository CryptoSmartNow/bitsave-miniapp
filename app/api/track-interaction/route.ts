import { NextRequest, NextResponse } from "next/server";
import { interactionTracker, UserInteraction } from "@/lib/interactionTracker";

export async function POST(request: NextRequest) {
  try {
    const interaction: Omit<UserInteraction, "id" | "timestamp" | "sessionId"> =
      await request.json();

    // Add IP address from request headers
    const ip =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    const enhancedInteraction = {
      ...interaction,
      ip: Array.isArray(ip) ? ip[0] : ip,
    };

    await interactionTracker.trackInteraction(enhancedInteraction);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error tracking interaction:", error);
    return NextResponse.json({ error: "Failed to track interaction" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
