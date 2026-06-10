import { NextResponse } from "next/server";
import { processGraph } from "@/lib/graphProcessor";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const edges = body?.edges;

    if (!Array.isArray(edges)) {
      return NextResponse.json(
        { error: "Request body must include an 'edges' array." },
        { status: 400, headers: corsHeaders }
      );
    }

    const graphResult = processGraph(edges);

    const response = {
      user_id: process.env.USER_ID,
      email_id: process.env.EMAIL_ID,
      enrollment_number: process.env.ENROLLMENT_NUMBER,
      ...graphResult,
    };

    return NextResponse.json(response, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400, headers: corsHeaders }
    );
  }
}
