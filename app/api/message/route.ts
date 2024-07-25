import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ReadableStream, WritableStream } from "node:stream/web";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    chatId: string;
    message: string;
  };

  const formData = new FormData();
  formData.append("message", payload.message);

  const authToken = cookies().get("auth-token")?.value!;
  const chatCompletionRequest = await fetch(
    process.env.PDFQA_BACKEND + `/chats/${payload.chatId}`,
    {
      method: "POST",
      headers: {
        "Accept": "text/event-stream",
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    },
  );

  if (!chatCompletionRequest.body) {
    throw new Error("Invalid stream!!");
  }

  const reader = chatCompletionRequest.body.getReader();

  return new Response(
    // @ts-ignore
    new ReadableStream({
      async pull(controller) {
        const { value, done } = await reader.read();

        if (done) {
          controller.close();
        } else {
          console.log(new TextDecoder().decode(value) + "\n")
          controller.enqueue(value);
        }
      },
    }),
  );
}
