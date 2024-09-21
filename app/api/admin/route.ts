// app/api/admin/route.js
import { createClient } from "@supabase/supabase-js";
// import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
  try {
    // Parse the request body
    const { userId } = await request.json();

    // Query the 'admins' table to check if the user exists
    const { data, error } = await supabase
      .from("admins")
      .select("*") // Select all fields or specify what you need
      .eq("user_id", userId)
      .single(); // Use single if you expect only one record

    // Handle any errors from the query
    if (error) {
      return NextResponse.json(
        { error: "Error fetching admin data or user is not an admin" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // If data exists, the user is an admin
    if (data) {
      return NextResponse.json(
        { success: "You are an admin" },
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": process.env.REDIRECT!,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    return NextResponse.json(
      { failure: "User is not an admin" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.REDIRECT!,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
