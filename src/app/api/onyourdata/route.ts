// app/api/onyourdata/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOnYourData } from "@/util/openai";

export const runtime = "nodejs";         // ★ Edge → Node に強制

export const POST = async (req: NextRequest) => {
  try {
    const { message } = await req.json();
    const result   = await getOnYourData(message);
    const aiMessage = result[0].message.content;
    return NextResponse.json({ aiMessage });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message ?? "internal error" },
      { status: 500 }
    );
  }
};
