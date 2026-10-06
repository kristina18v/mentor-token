import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Startup што го креирал job-от
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Mentor на кој му е доделен job
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "open",
        "pending",
        "in-progress",
        "done",
        "rejected",
      ],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Job ||
  mongoose.model("Job", jobSchema);