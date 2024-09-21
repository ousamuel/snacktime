// app/api/user/route.js
// import { createClient } from '@supabase/supabase-js';
import { createClient } from "@/utils/supabase/server";

import { NextResponse } from "next/server";

export async function POST() {
  // Initialize Supabase client
  const supabase = createClient();
  // Fetch the authenticated user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }

  return NextResponse.json(
    { user },
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
