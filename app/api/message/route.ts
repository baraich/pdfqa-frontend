import { NextRequest, NextResponse } from "next/server";
import {cookies} from "next/headers";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    chatId: string;
    message: string
  };

  const formData = new FormData();
  formData.append("message", payload.message)

  const authToken = cookies().get("auth-token")?.value!;
  const chatCompletionRequest = await fetch(
    process.env.PDFQA_BACKEND + `/chats/${payload.chatId}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authToken}`,
      },
      body: formData
    },
  );

  return NextResponse.json(await chatCompletionRequest.json());
}
