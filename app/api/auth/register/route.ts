import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WalletService } from "@/lib/wallet";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse("Invalid email format", { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return new NextResponse("Password must be at least 6 characters", {
        status: 400,
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    // Generate custodial wallet
    const walletService = new WalletService();
    const { address, encryptedPrivateKey } =
      await walletService.generateCustodialWallet();

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user with custodial wallet
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        custodialWalletAddress: address,
        encryptedPrivateKey,
      },
    });

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        custodialWalletAddress: address,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
