import mongoose from "mongoose";

import { Schema, models } from "mongoose";

const influencerSchema = new Schema(
  {
    influencerId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    claim: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Not Verfied",
    },
    score: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
    },
  },
  { timestamps: true }
);

const Influencer =
  models.Influencer || mongoose.model("Influencer", influencerSchema);
export default Influencer;
