import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  try {
    const formData = new FormData();
    formData.append("username", payload.username);
    formData.append("password", payload.password);

    const createUserRequest = await fetch(
      process.env.PDFQA_BACKEND! + "/auth/create-user",
      {
        method: "POST",
        body: formData,
      },
    );

    const response = await createUserRequest.json();

    return NextResponse.json(
      {
        status: response.status === "OK" ? "OK" : "ERROR",
      },
      {
        status: response.status === "OK" ? 200 : 500,
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: "ERROR",
      },
      { status: 500 },
    );
  }
}
