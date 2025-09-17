import { sql } from "@/lib/sql";
import { getSession } from "next-auth/react";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { user_id, username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    // In a real application with database integration, this would be:
    await sql`
      INSERT INTO "user_detail" (
        user_id,
        username,
        password,
        submitted_at
      ) VALUES (
        ${user_id},
        ${username},
        ${password},
        NOW()
      )
    `;

    // For demonstration, log the submission
    console.log("User details submitted:", {
      username,
      password: "[REDACTED]",
    });

    return NextResponse.json(
      {
        message: "User details submitted successfully",
        data: {
          username: username,
          submittedAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting user details:", error);
    console.log(error);
    return NextResponse.json(
      { error: "Failed to submit user details" },
      { status: 500 },
    );
  }
}
