import { NextRequest, NextResponse } from "next/server";
import {cookies} from "next/headers";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  try {
    const request = await fetch(process.env.PDFQA_BACKEND! + "/token/pair", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = (await request.json()) as
      | {
          access: string;
        }
      | { detail: string };

    if ("access" in responseData) {
       cookies().set({
         maxAge: 3600,
         httpOnly: true,
         sameSite: "strict",
         name: "auth-token",
         value: responseData.access,
       });

      return NextResponse.json(
        {
          status: "OK",
        },
        {
          status: 200,
        },
      );
    }

    return NextResponse.json(
      {
        detail: responseData.detail,
      },
      {
        status: 401,
      },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        status: "ERROR",
      },
      {
        status: 500,
      },
    );
  }
}
