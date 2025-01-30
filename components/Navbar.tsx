import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="bg-blue-600">
      <nav className="flex items-center justify-between px-6 py-4 md:px-10">
        <h1 className="text-white font-semibold text-lg">Verify Influencer</h1>

        <div className="flex space-x-6">
          <Link href="/" className="text-white hover:text-gray-300">
            Influencers
          </Link>
          <Link href="/influencer" className="text-white hover:text-gray-300">
            LeaderBoard
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
