import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const { chatId } = await request.json();
  if (!chatId) throw new Error("Invalid chat id!");

  const authToken = cookies().get("auth-token")?.value!;
  const messagesRequest = await fetch(
    `${process.env.PDFQA_BACKEND}/chats/${chatId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  return NextResponse.json(await messagesRequest.json());
}
