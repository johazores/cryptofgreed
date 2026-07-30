import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "NFT custody operations are disabled while the commercial game is separated from the legacy blockchain prototype.",
    },
    { status: 410 }
  );
}
