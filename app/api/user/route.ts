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
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
