import { createClient } from "@supabase/supabase-js";
import { update } from "lodash";
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
// need to implement looping through ordered items to edit
// product stock(weight/units) and other product details

// maybe have to edit payment details setup
export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const formData = await request.json();
    const ordered_items = await formData.orderedItems;
    const paymentInfo = await formData.paymentInfo;
    const telegram_name = await paymentInfo.telegramName;
    const amount_paid = await paymentInfo.amountPaid;
    const payment_type = (await paymentInfo.paymentType) || "cash"; // Fallback to "cash" if not provided
    const { error } = await supabase.from("orders").insert({
      ordered_items,
      telegram_name,
      payment_type,
      payment_details: paymentInfo,
      amount_paid,
    });
    // amount_paid and payment_type and telegram_name are all inside payment_details
    // may not need
    if (error) {
      return NextResponse.json({ error: "Error inserting" });
    }

    for (const i in ordered_items) {
      const item = await ordered_items[i];
      const productId = await item.id;
      if (item.category == "flower") {
        const { error: updateProductForOrderError } = await supabase.rpc(
          "update_flower_for_order",
          {
            row_id: productId,
            total_cost: item.total_cost,
            weight_sold: item.total_weight_in_lbs,
          }
        );
        if (updateProductForOrderError) {
          return NextResponse.json(
            { error: updateProductForOrderError },
            {
              status: 500,
              headers: { "Access-Control-Allow-Origin": "*" },
            }
          );
        }
      } else {
        const { error: updateCondimentForOrderError } = await supabase.rpc(
          "update_condiment_for_order",
          {
            row_id: productId,
            total_cost: item.total_cost,
            units_sold: parseInt(item.quantity),
          }
        );
        if (updateCondimentForOrderError) {
          return NextResponse.json(
            { error: updateCondimentForOrderError },
            {
              status: 500,
              headers: { "Access-Control-Allow-Origin": "*" },
            }
          );
        }
        // exampple data
        // id: '0386180a-dfb8-4636-9d47-97c5f8daaf26',
        // name: 'Blue Drank',
        // category: 'flower',
        // option_weight: 'eighth',
        // option_cost: 45,
        // quantity: '3',
        // total_weight_in_lbs: 0.0234375,
        // total_cost: 135
      }
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
