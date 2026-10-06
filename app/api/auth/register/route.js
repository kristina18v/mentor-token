import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// POST /api/auth/register
export async function POST(request) {
  try {
    const { name, surname, email, password, role } = await request.json();

    if (!name || !surname || !email || !password || !role) {
      return Response.json(
        { message: "Сите полиња се задолжителни" },
        { status: 400 }
      );
    }

    if (!["startup", "mentor"].includes(role)) {
      return Response.json(
        { message: "Невалиден тип на account" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { message: "Лозинката мора да има најмалку 8 карактери" },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return Response.json(
        { message: "Корисник со овој email веќе постои" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      surname,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    return Response.json(
      {
        status: "Success",
        data: {
          user: {
            id: newUser._id,
            name: newUser.name,
            surname: newUser.surname,
            email: newUser.email,
            role: newUser.role,
          },
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: 500 }
    );
  }
}