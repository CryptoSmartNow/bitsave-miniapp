import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 },
      );
    }

    const accessToken = authorization.replace("Bearer ", "");

    // Twitter API v2 user profile endpoint
    const userUrl =
      "https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url,public_metrics";

    const response = await fetch(userUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Twitter user fetch failed:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: response.status },
      );
    }

    const userData = await response.json();

    // Return the user data
    return NextResponse.json({
      id: userData.data.id,
      name: userData.data.name,
      username: userData.data.username,
      profile_image_url: userData.data.profile_image_url,
      public_metrics: userData.data.public_metrics,
    });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
