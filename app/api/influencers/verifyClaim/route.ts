import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { claimText, id } = await request.json();

  console.log("id&claim", claimText, id);

  // Verify the claim using ChatGPT
  const verificationStatus = await verifyClaim(claimText);
  const trustScore = await generateTrustScore(claimText, verificationStatus);

  // Categorize the claim
  const category = await categorizeClaim(claimText);
  const uniqueCategories = [...new Set(category)];

  console.log("Staus", verificationStatus, category, trustScore);

  // Update MongoDB with verification status, trust score, and category
  await updateClaimInMongoDB(id, verificationStatus, trustScore, category);

  return NextResponse.json({ verificationStatus, trustScore, category });
}

const verifyClaim = async (claimText: string) => {
  const prompt = `Cross-reference the following health claim with reliable medical journals and scientific studies. 
    Based on the available evidence, determine:
    1. **Verification Status**: Choose one of the following - Verified (scientifically supported by credible sources), Questionable (some conflicting evidence or insufficient research), or Debunked (scientifically disproven or widely refuted).
    2. **Journal Name**: Mention a well-known medical journal, research paper, or source that supports or refutes the claim.
    
    ONLY return the response in this exact format:
    Claim: "<Claim Text>"
    Status: <Verified/Questionable/Debunked>
    Journal: <Journal Name and also short description about Journal in 40 words or "No specific source available">
    
    Claim: "${claimText}"`;

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
    });
    return response.choices?.[0]?.message?.content?.trim() || "Questionable";
  } catch (error) {
    console.error("Error verifying claim:", error);
    return "Questionable";
  }
};

const generateTrustScore = async (
  claimText: string,
  verificationStatus: string
) => {
  const prompt = `Evaluate the trustworthiness of the following claim. Claim: ${claimText} Verification Status: ${verificationStatus}. Score confidence on a scale from 0 to 100.`;
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
    });
    return parseInt(response.choices?.[0]?.message?.content?.trim() || "50");
  } catch (error) {
    console.error("Error generating trust score:", error);
    return 50;
  }
};

const categorizeClaim = async (claimText: string) => {
  const prompt = `Categorize the following health claim into ONE of these categories: Nutrition, Medicine, Mental Health, or Other. ONLY return the category name without any numbering or explanation. Claim: ${claimText}`;
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
    });
    console.log("Re", response.choices[0]?.message);
    return response.choices[0]?.message?.content?.trim() || "Other";
  } catch (error) {
    console.error("Error categorizing claim:", error);
    return "Other";
  }
};

const updateClaimInMongoDB = async (
  id: string,
  verificationStatus: string,
  trustScore: number,
  category: string
) => {
  try {
    const { db } = await connectToDatabase();
    const claimsCollection = db.collection("influencers");
    await claimsCollection.updateOne(
      { influencerId: id },
      { $set: { verified: verificationStatus, trustScore, category } }
    );
  } catch (error) {
    console.error("Error updating claim in MongoDB:", error);
  }
};
