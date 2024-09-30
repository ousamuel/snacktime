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
      if (error.code == "23505") {
        return NextResponse.json({
          status: 400,
          error: "Product Name already in use",
        });
      }
      return NextResponse.json({ status: 400, error: error.message });
    }
    return NextResponse.json({ status: 201, success: "New product added" });
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
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data, error } = await supabase
      .from("products")
      .update(formData)
      .eq("id", formData.id);
    if (error) {
      console.log(error);
      if (error.code == "23505") {
        return NextResponse.json({
          status: 400,
          error: "Product Name already in use",
        });
      }
      return NextResponse.json({ status: 400, error: error.message });
    }
    return NextResponse.json({ status: 201, success: "Successful edit" });
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

export async function DELETE(request: Request) {
  try {
    const formData = await request.json();
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data, error } = await supabase
      .from("products")
      .delete()
      .in("id", formData);

    if (error) {
      console.log(error);
      return NextResponse.json({ error: "Error deleting" });
    }
    return NextResponse.json(
      { data },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred" },
      {
        status: 500,
      }
    );
  }
}
