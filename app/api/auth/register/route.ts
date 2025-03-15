import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    // Here you would typically:
    // 1. Check if user already exists
    // 2. Validate email format
    // 3. Validate password strength
    // 4. Store user in your database

    // Example validation
    if (password.length < 6) {
      return new NextResponse("Password must be at least 6 characters", {
        status: 400,
      });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Store user in database (example)
    // const user = await db.user.create({
    //   data: {
    //     email,
    //     password: hashedPassword,
    //   },
    // });

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
