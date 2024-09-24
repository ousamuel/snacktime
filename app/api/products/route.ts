import { createClient } from "@supabase/supabase-js";
// import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    // flower, vape, concentrate, edible
    // Insert the support ticket
    const { data, error } = await supabase.from("products").select("*");

    // .eq("category", "flower");
    // console.log(data);
    if (error) {
      return NextResponse.json(
        { error },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": process.env.REDIRECT!,
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}
export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error } = await supabase.from("products").insert(formData);
    if (error) {
      console.log(error);
      return NextResponse.json({ error: "Error inserting" });
    }
    return NextResponse.json({ status: 201, success: "Successful insert" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
export async function PATCH(request: Request) {
  try {
    const formData = await request.json();
    const supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );
    const { data, error } = await supabase
      .from("products")
      .update(formData)
      .eq("id", formData.id);
    return NextResponse.json(
      { data },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": process.env.REDIRECT!,
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
