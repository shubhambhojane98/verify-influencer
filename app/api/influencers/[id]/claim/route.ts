import { connectToDatabase } from "@/lib/mongodb";
import { mockTweets } from "@/MockData";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request, { params }: any) {
  const { id } = await params;

  // Fetch mock data for the influencer
  const tweets = mockTweets.filter((tweet) => tweet.id === id);
  const influencerName = tweets[0].influencer;
  const followers = tweets[0].followers;
  const skills = tweets[0].skills;
  const bio = tweets[0].bio;
  console.log("tweets", tweets, influencerName, skills);

  // Process claims using ChatGPT
  const claims = await extractClaimsFromPosts([...tweets]);
  console.log("claim", claims);

  // Remove duplicate claims
  const uniqueClaims = removeDuplicateClaims(claims);
  console.log("uniqueClaims", uniqueClaims.length);

  // Save claims to MongoDB
  await saveClaimsToMongoDB(
    id,
    influencerName,
    followers,
    skills,
    bio,
    uniqueClaims
  );

  return NextResponse.json({ claims: uniqueClaims });
}

const extractClaimsFromPosts = async (posts: any[]) => {
  const claims = [];

  // Use ChatGPT to process the posts and extract claims
  for (const post of posts) {
    const claim = await extractClaimFromText(post.text || post.transcript);
    claims.push({
      claim: claim,
      source: post.text ? "Tweet" : "Podcast",
      date: post.date,
    });
  }

  return claims;
};

const extractClaimFromText = async (text: string) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Extract health  claims from this text : ${text}`,
        },
      ],
      model: "gpt-4o",
    });

    return (
      response.choices?.[0]?.message?.content?.trim() ?? "No content available"
    );
  } catch (error) {
    console.error("Error extracting claims:", error);
    return "";
  }
};

const removeDuplicateClaims = (claims: any[]) => {
  const uniqueClaims: any[] = [];
  const claimTexts = new Set();

  claims.forEach((claim) => {
    if (!claimTexts.has(claim.claim)) {
      uniqueClaims.push(claim);
      claimTexts.add(claim.claim);
    }
  });

  return uniqueClaims;
};

// const saveClaimsToMongoDB = async (influencerId: string, claims: any[]) => {
//   try {
//     const { db } = await connectToDatabase();

//     const claimsCollection = db.collection("claims");

//     // Save each claim to MongoDB
//     for (const claim of claims) {
//       await claimsCollection.insertOne({
//         influencerId,
//         claim: claim.claim,
//         source: claim.source,
//         date: claim.date,
//         verified: "Pending", // Set as pending for now
//         trustScore: Math.floor(Math.random() * 101), // Random trust score between 0 and 100
//       });
//     }
//   } catch (error) {
//     console.error("Error saving to MongoDB:", error);
//   }
// };

const saveClaimsToMongoDB = async (
  id: string,
  influencerName: string,
  followers: string,
  skills: string | string[],
  bio: string,
  claims: any[]
) => {
  try {
    const { db } = await connectToDatabase();
    const influencersCollection = db.collection("influencers");

    for (const claim of claims) {
      // Check if the claim already exists for the same influencer
      const existingClaim = await influencersCollection.findOne({
        name: influencerName,
        // claim: claim.claim, // Ensure the claim text matches exactly
      });

      if (!existingClaim) {
        // If no duplicate found, insert the new claim
        await influencersCollection.insertOne({
          influencerId: id,
          name: influencerName,
          bio: bio,
          skills: skills,
          claim: claim.claim,
          followers: followers,
          status: "Not Verified",
          score: 0,
          category: claim.category || "Unknown",
          createdAt: new Date().toLocaleDateString("en-CA"),
        });
      }
    }
  } catch (error) {
    console.error("Error saving claims to MongoDB:", error);
  }
};
