import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import { protect } from "@/lib/auth";


// GET /api/jobs
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

    const currentUser = await User.findById(user._id);

    if (!currentUser) {
      return Response.json(
        { message: "Корисникот не е пронајден" },
        { status: 404 }
      );
    }

    let jobs;

    // Ако е mentor
    if (currentUser.role === "mentor") {
      jobs = await Job.find({
        $or: [
          { status: "open" },
          { mentor: currentUser._id },
        ],
      })
        .populate("startup", "name surname email")
        .sort({ createdAt: -1 });
    }

    // Ако е startup
    else if (currentUser.role === "startup") {
      jobs = await Job.find({
        startup: currentUser._id,
      })
        .populate("mentor", "name surname email")
        .sort({ createdAt: -1 });
    }

    return Response.json(jobs, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// POST /api/jobs
export async function POST(request) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }

    await connectDB();

    const currentUser = await User.findById(user._id);

    if (!currentUser) {
      return Response.json(
        { message: "Корисникот не е пронајден" },
        { status: 404 }
      );
    }

    // Само startup може да креира job
    if (currentUser.role !== "startup") {
      return Response.json(
        { message: "Само startup може да креира job" },
        { status: 403 }
      );
    }

    const {
      title,
      description,
      mentor,
    } = await request.json();

    if (!title || !description) {
      return Response.json(
        {
          message:
            "Title и description се задолжителни",
        },
        { status: 400 }
      );
    }

    let selectedMentor = null;
    let status = "open";

    // Ако startup избрал конкретен mentor
    if (mentor) {
      const mentorUser = await User.findById(mentor);

      if (
        !mentorUser ||
        mentorUser.role !== "mentor"
      ) {
        return Response.json(
          { message: "Невалиден mentor" },
          { status: 400 }
        );
      }

      selectedMentor = mentorUser._id;
      status = "pending";
    }

    const job = await Job.create({
      title,
      description,
      startup: currentUser._id,
      mentor: selectedMentor,
      status,
    });

    await job.populate(
      "startup",
      "name surname email"
    );

    if (selectedMentor) {
      await job.populate(
        "mentor",
        "name surname email"
      );
    }

    return Response.json(
      {
        message: "Job е успешно креиран",
        job,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}