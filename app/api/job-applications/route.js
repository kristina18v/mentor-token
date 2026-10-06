import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import JobApplication from "@/models/JobApplication";
import User from "@/models/User";
import { protect } from "@/lib/auth";


// GET /api/job-applications
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

    let applications;

    // Mentor ги гледа своите испратени апликации
    if (currentUser.role === "mentor") {
      applications = await JobApplication.find({
        mentor: currentUser._id,
      })
        .populate({
          path: "job",
          populate: {
            path: "startup",
            select: "name surname email",
          },
        })
        .sort({ createdAt: -1 });
    }

    // Startup ги гледа апликациите за своите jobs
    else if (currentUser.role === "startup") {
      const startupJobs = await Job.find({
        startup: currentUser._id,
      }).select("_id");

      const jobIds = startupJobs.map(
        (job) => job._id
      );

      applications = await JobApplication.find({
        job: {
          $in: jobIds,
        },
      })
        .populate("mentor", "name surname email")
        .populate("job")
        .sort({ createdAt: -1 });
    }

    return Response.json(
      applications,
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// POST /api/job-applications
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

    // Само mentor може да аплицира
    if (currentUser.role !== "mentor") {
      return Response.json(
        {
          message:
            "Само mentor може да аплицира на job",
        },
        { status: 403 }
      );
    }

    const {
      job,
      message,
    } = await request.json();

    if (!job) {
      return Response.json(
        { message: "Job е задолжителен" },
        { status: 400 }
      );
    }

    const selectedJob = await Job.findById(job);

    if (!selectedJob) {
      return Response.json(
        { message: "Job не е пронајден" },
        { status: 404 }
      );
    }

    // Mentor може да аплицира само на open job
    if (selectedJob.status !== "open") {
      return Response.json(
        {
          message:
            "Овој job повеќе не е достапен за аплицирање",
        },
        { status: 400 }
      );
    }

    // Проверуваме дали веќе аплицирал
    const existingApplication =
      await JobApplication.findOne({
        job: selectedJob._id,
        mentor: currentUser._id,
      });

    if (existingApplication) {
      return Response.json(
        {
          message:
            "Веќе имате аплицирано на овој job",
        },
        { status: 400 }
      );
    }

    const application =
      await JobApplication.create({
        job: selectedJob._id,
        mentor: currentUser._id,
        message,
        status: "pending",
      });

    await application.populate({
      path: "job",
      populate: {
        path: "startup",
        select: "name surname email",
      },
    });

    return Response.json(
      {
        message: "Успешно аплициравте на job",
        application,
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