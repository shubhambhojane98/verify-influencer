import axios from "axios";

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

export const fetchTweets = async (username, keywords = []) => {
  const endpoint = `https://api.twitter.com/2/tweets/search/recent`;
  const query = `from:${username} (${keywords.join(" OR ")})`;

  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        query, // Example: "from:username (health OR fitness OR diet)"
        max_results: 10, // Adjust based on needs
        "tweet.fields": "created_at,author_id,text",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching tweets:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch tweets");
  }
};
