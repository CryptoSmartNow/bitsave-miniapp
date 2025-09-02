import { NextResponse } from "next/server";
import { getFarcasterDomainManifest } from "@/lib/utils";

export async function GET() {
  try {
    return NextResponse.json({ hi: "world" });
    const config = await getFarcasterDomainManifest();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error generating metadata:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
