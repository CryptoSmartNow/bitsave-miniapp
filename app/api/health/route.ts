import { NextResponse } from "next/server";
import { checkMongoDBHealth } from "@/lib/mongodb";

export async function GET() {
  try {
    const mongoHealth = await checkMongoDBHealth();

    const healthStatus = {
      status: mongoHealth.connected ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        mongodb: {
          connected: mongoHealth.connected,
          error: mongoHealth.error || null,
        },
      },
    };

    return NextResponse.json(healthStatus, {
      status: mongoHealth.connected ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
