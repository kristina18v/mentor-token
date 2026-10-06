import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import { protect } from "@/lib/auth";


// GET /api/jobs/:id
export async function GET(request, { params }) {
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
    const { id } = await params;

    const job = await Job.findById(id)
      .populate("startup", "name surname email")
      .populate("mentor", "name surname email");

    if (!job) {
      return Response.json(
        { message: "Job не е пронајден" },
        { status: 404 }
      );
    }

    // Startup може да ги гледа само своите jobs
    if (
      currentUser.role === "startup" &&
      job.startup._id.toString() !==
        currentUser._id.toString()
    ) {
      return Response.json(
        { message: "Немате пристап до овој job" },
        { status: 403 }
      );
    }

    // Mentor може да гледа open jobs или jobs доделени на него
    if (
      currentUser.role === "mentor" &&
      job.status !== "open" &&
      job.mentor?._id.toString() !==
        currentUser._id.toString()
    ) {
      return Response.json(
        { message: "Немате пристап до овој job" },
        { status: 403 }
      );
    }

    return Response.json(
      { job },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// PATCH /api/jobs/:id
export async function PATCH(request, { params }) {
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
    const { id } = await params;

    const { status } = await request.json();

    const job = await Job.findById(id);

    if (!job) {
      return Response.json(
        { message: "Job не е пронајден" },
        { status: 404 }
      );
    }

    // Само mentor-от на кој му е доделен job-от
    // може да му го менува статусот
    if (
      currentUser.role !== "mentor" ||
      !job.mentor ||
      job.mentor.toString() !==
        currentUser._id.toString()
    ) {
      return Response.json(
        {
          message:
            "Немате дозвола да го промените овој job",
        },
        { status: 403 }
      );
    }

    const allowedStatuses = [
      "in-progress",
      "done",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return Response.json(
        { message: "Невалиден статус" },
        { status: 400 }
      );
    }

    job.status = status;

    await job.save();

    await job.populate(
      "startup",
      "name surname email"
    );

    await job.populate(
      "mentor",
      "name surname email"
    );

    return Response.json(
      {
        message: "Статусот е успешно променет",
        job,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// DELETE /api/jobs/:id
export async function DELETE(request, { params }) {
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
    const { id } = await params;

    const job = await Job.findById(id);

    if (!job) {
      return Response.json(
        { message: "Job не е пронајден" },
        { status: 404 }
      );
    }

    // Само startup-от што го креирал job-от
    // може да го избрише
    if (
      currentUser.role !== "startup" ||
      job.startup.toString() !==
        currentUser._id.toString()
    ) {
      return Response.json(
        {
          message:
            "Немате дозвола да го избришете овој job",
        },
        { status: 403 }
      );
    }

    await Job.findByIdAndDelete(id);

    return Response.json(
      { message: "Job е успешно избришан" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}