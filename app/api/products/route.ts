import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );
    // flower, vape, concentrate, edible
    // Insert the support ticket
    const { data: FlowerData, error: FlowerError } = await supabase
      .from("products")
      .select("*")
      .eq("category", "flower");

    if (FlowerError) {
      return NextResponse.json(
        { failure: FlowerError },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    return NextResponse.json({ flowerData: FlowerData }, { status: 201 });
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
      { data: formData },
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
    console.error(error);

    return NextResponse.json(
      { error: "An error occurred" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
