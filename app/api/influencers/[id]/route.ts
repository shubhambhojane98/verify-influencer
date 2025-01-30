import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Influencer from "@/models/Influencer";

export async function GET(req: Request, { params }: any) {
  const { id } = await params;

  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const influencer = await Influencer.findOne({ influencerId: id });
    console.log("influencer", influencer);

    if (!influencer) {
      return NextResponse.json(
        { error: "Influencer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(influencer, { status: 200 });
  } catch (error) {
    console.error("Error fetching influencer:", error);
    return NextResponse.json(
      { error: "Failed to fetch influencer" },
      { status: 500 }
    );
  }
}
