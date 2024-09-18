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
      .eq("category", "Flower");

    if (FlowerError) {
      return NextResponse.json({ failure: "no flowers" });
    }

    return NextResponse.json({ flowerData: FlowerData }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
