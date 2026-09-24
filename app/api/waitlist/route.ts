import { NextResponse } from "next/server";
import { addToWaitlist } from "@/db/waitlist";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: unknown; source?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source = typeof body.source === "string" ? body.source.slice(0, 40) : "website";

    if (!emailPattern.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const result = await addToWaitlist({ email, source });
    return NextResponse.json({
      ok: true,
      message: result.inserted
        ? "Youâ€™re on the Sunshot AI waitlist."
        : "This email is already on the waitlist.",
    });
  } catch (error) {
    console.error("waitlist_error", error);
    return NextResponse.json(
      { error: "The waitlist is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}

