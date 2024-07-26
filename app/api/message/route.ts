import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ReadableStream } from "node:stream/web";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    chatId: string;
    message: string;
  };

  const formData = new FormData();
  formData.append("chat_id", payload.chatId);
  formData.append("message", payload.message);

  const authToken = cookies().get("auth-token")?.value!;
  const chatCompletionRequest = await fetch(
    process.env.PDFQA_BACKEND!.replace("/api", "") + `/invoke_chain/`,
    {
      method: "POST",
      headers: {
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
          controller.enqueue(value);
        }
      },
    }),
  );
}
