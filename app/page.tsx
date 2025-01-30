"use client";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { mockTweets } from "@/MockData";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Claim {
  claim: string;
  source: string;
  date: string;
  verified: string;
  trustScore: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchClaims = async (id: string) => {
    setLoading(true);
    const response = await fetch(`/api/influencers/${id}/claim`);
    const data = await response.json();
    console.log("ClaimData", data);
    setClaims(data.claims);
    router.push(`/influencer/${id}`);
  };

  // if (loading) return <div>Loading...</div>;

  return (
    <div className="mx-10 mt-5">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          Extracting Claim....
        </div>
      ) : (
        <div>
          <h1 className="text-center font-semibold text-xl mb-5">
            Influencer list
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockTweets.map((item) => (
              <div
                className="rounded-lg flex flex-col justify-evenly shadow-md border p-2"
                key={item.id}
              >
                <h2 className="mb-2">Influencer Name : {item.influencer}</h2>
                <h2 className="mb-2"> Followers : {item.followers}</h2>
                <p className="mb-2"> Tweet : {item.text}</p>
                <p className="mb-2"> Transcript : {item.transcript}</p>
                <div className="text-center">
                  <Button
                    className="bg-blue-600 hover:bg-blue-800"
                    onClick={(id) => fetchClaims(item.id)}
                  >
                    Research
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
