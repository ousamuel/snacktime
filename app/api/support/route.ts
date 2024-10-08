import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );
    // Parse the request body
    const { category, subject, description, userEmail, userId } =
      await request.json();

    console.log;
    // Insert the support ticket
    const { error } = await supabase.from("customer_tickets").insert([
      {
        category,
        subject,
        description,
        user_email: userEmail,
        user_id: userId,
      },
    ]);

    if (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Error submitting ticket" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    return NextResponse.json(
      { success: "Ticket submitted successfully" },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": process.env.REDIRECT!,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
