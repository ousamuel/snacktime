import { createClient } from "@supabase/supabase-js";
// import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data, error } = await supabase.from("orders").select("*");
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
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const formData = await request.json();
    const paymentInfo = formData.paymentInfo;
    const telegram_name = paymentInfo.telegramName;
    const amount_paid = paymentInfo.amountPaid;
    const ordered_items = formData.orderedItems;
    const payment_type = paymentInfo.paymentType || "cash"; // Fallback to "cash" if not provided
    const { error } = await supabase.from("orders").insert({
      ordered_items,
      telegram_name,
      payment_type,
      payment_details: paymentInfo,
      amount_paid,
    });
    if (error) {
      return NextResponse.json({ error: "Error inserting" });
    }
    return NextResponse.json({ status: 201, success: "Successful insert" });
  } catch (error) {
    return NextResponse.json(
      { error },
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
      return NextResponse.json({ error: "Error patching" });
    }
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
