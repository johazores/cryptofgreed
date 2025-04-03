import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ message: "You must be logged in" }),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email } = body;

    if (!email) {
      return new NextResponse(
        JSON.stringify({ message: "Email is required" }),
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid email format" }),
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: session.user.id
        }
      }
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "This email is already in use" }),
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        name: name || null, // Allow removing name by setting to null
        email
      }
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("[USER_PROFILE_UPDATE]", error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong" }),
      { status: 500 }
    );
  }
} 