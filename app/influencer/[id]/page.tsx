"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Claim {
  claim: string;
  source: string;
  date: string;
  verified: string;
  trustScore: number;
}

const InfluencerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [influencer, setInfluencer] = useState<any>(null);
  const router = useRouter();

  console.log(id);

  useEffect(() => {
    if (id && claims) {
      const fetchInfluencer = async () => {
        try {
          const response = await fetch(`/api/influencers/${id}`);
          const data = await response.json();
          if (response.ok) {
            setInfluencer(data);
          } else {
            console.error("Error fetching influencer:", data.error);
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchInfluencer();
    }
  }, [id]);

  const verifyClaim = async (claimText: string, id: string) => {
    console.log("claimText", claimText);
    setLoading(true);
    const response = await fetch("/api/influencers/verifyClaim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimText, id }),
    });

    const data = await response.json();
    console.log("VerifyClaim", data);
    setInfluencer((prevState: any) => ({
      ...prevState,
      verified: data.verificationStatus,
      category: data.category,
      trustScore: data.trustScore,
    }));
    setLoading(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading......
      </div>
    );

  console.log("claims", claims);
  console.log("INfluencer Detail", influencer.verified);

  const formattedClaim = influencer.claim;

  console.log(formattedClaim[1]);
  const InfluncerId = influencer.influencerId;

  return (
    <div>
      <div className="m-10 p-6 bg-white shadow-lg rounded-lg">
        {/* Influencer Name */}
        <h1 className="text-xl font-bold mb-4">
          Influencer Name:{" "}
          <span className="font-semibold">{influencer.name}</span>
        </h1>

        {/* Status & Category */}
        <div className="mb-4">
          <h2 className="text-gray-700">
            Status:{" "}
            <span
              className={`font-medium ${
                influencer.verified ? "text-green-500" : "text-red-500"
              }`}
            >
              {influencer.verified ? "Verified" : "Not Verified"}
            </span>
          </h2>
          <h2 className="text-gray-700">
            Category: <span className="font-medium">{influencer.category}</span>
          </h2>
        </div>

        {/* Bio */}
        <p className="max-w-lg text-gray-600 mb-4">Bio: {influencer.bio}</p>

        {/* Skills Section */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="font-medium text-gray-700">Skills:</span>
          {influencer.skills.map((skill: string, i: number) => (
            <Badge
              key={i}
              variant="outline"
              className="px-2 py-1 text-sm border-gray-400"
            >
              {skill}
            </Badge>
          ))}
        </div>

        {/* Trust Score & Followers */}
        <div className="mb-4">
          <h2 className="text-gray-700">
            Trust Score:{" "}
            <span className="font-semibold">{influencer.trustScore || 0}</span>
          </h2>
          <h2 className="text-gray-700">
            Followers:{" "}
            <span className="font-semibold">{influencer.followers}</span>
          </h2>
        </div>

        {/* Claims Section */}
        <div className="max-w-xl mb-4">
          <pre className="text-gray-700 whitespace-pre-wrap break-words">
            Claim: <span className="font-medium">{influencer.claim}</span>
          </pre>
        </div>

        <Button
          onClick={() => verifyClaim(formattedClaim, id)}
          variant="destructive"
        >
          Verify Claim
        </Button>
      </div>
      {influencer.verified ? (
        <div className="m-10">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Verified Claims
          </h1>

          <pre className="text-gray-800 bg-white p-4 rounded-md shadow-md whitespace-pre-wrap break-words">
            {influencer.verified}
          </pre>
        </div>
      ) : null}
    </div>
  );
};

export default InfluencerDetail;
