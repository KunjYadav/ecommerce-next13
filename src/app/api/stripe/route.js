import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";

const stripe = require("stripe")(
  "sk_test_51NO2mGSAMfG2LwLyxdybY54zy5vR1LIQY2It1JeGldsYFMm2QKcIWcyckLI4uQ0ifP2252PMiR4pExMn7gJHS2yX00qI7IFMYP"
);

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const res = await req.json();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: res,
        mode: "payment",
        success_url: "https://ecommerce-next13js.vercel.app/checkout" + "?status=success",
        cancel_url: "https://ecommerce-next13js.vercel.app/checkout" + "?status=cancel",
      });

      return NextResponse.json({
        success: true,
        id: session.id,
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "You are not authenticated",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Something went wrong ! Please try again",
    });
  }
}
