import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Job from "@/models/Job";
import { protect } from "@/lib/auth";

// GET /api/mentors
export async function GET(request) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }

    await connectDB();

    const mentors = await User.find({
      role: "mentor",
    }).select("-password");

    const mentorsWithJobs = await Promise.all(
      mentors.map(async (mentor) => {
        const achievedJobs = await Job.countDocuments({
          mentor: mentor._id,
          status: "done",
        });

        return {
          _id: mentor._id,
          name: mentor.name,
          surname: mentor.surname,
          email: mentor.email,
          achievedJobs,
        };
      })
    );

    mentorsWithJobs.sort(
      (a, b) => b.achievedJobs - a.achievedJobs
    );

    return Response.json(
      mentorsWithJobs,
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}