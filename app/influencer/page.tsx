"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const leaderBoard = () => {
  const [influencers, setInfluencers] = useState<any[]>([]);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const response = await fetch("/api/influencers");
        if (response.ok) {
          const data = await response.json();
          const sortedInfluencers = data.sort(
            (a: any, b: any) => b.trustScore - a.trustScore
          );
          setInfluencers(sortedInfluencers);
        } else {
          console.error("Failed to fetch influencers");
        }
      } catch (error) {
        console.error("Error fetching influencers:", error);
      }
    };

    fetchInfluencers();
  }, []);

  return (
    <div className="m-10">
      <table className="w-full text-sm text-left border rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Influencer
            </th>
            <th scope="col" className="px-6 py-3">
              Followers
            </th>
            <th scope="col" className="px-6 py-3">
              Trust Score
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {influencers.map((influencer) => (
            <tr
              key={influencer._id}
              className="bg-white border-b hover:bg-gray-50"
            >
              <td className="px-6 py-4">
                <Link href={`/influencer/${influencer.influencerId}`}>
                  {influencer.name}
                </Link>
              </td>
              <td className="px-6 py-4">{influencer.followers}</td>
              <td className="px-6 py-4">{influencer.trustScore}</td>
              <td className="px-6 py-4">
                {influencer.verified ? "Verified" : "Not Verified"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default leaderBoard;
