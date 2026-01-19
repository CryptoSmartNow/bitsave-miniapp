import { NextRequest, NextResponse } from "next/server";
import { getFarcasterDomainManifest } from "@/lib/utils";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host') ?? undefined;
    const config = await getFarcasterDomainManifest(host);
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error generating metadata:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
