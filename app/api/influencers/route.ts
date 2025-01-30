import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { db } = await connectToDatabase();

    const influencers = await db.collection("influencers").find().toArray();

    return NextResponse.json(influencers, { status: 200 });
  } catch (error) {
    console.error("Error fetching influencers:", error);
    return NextResponse.json(
      { message: "Error fetching influencers." },
      { status: 500 }
    );
  }
}
