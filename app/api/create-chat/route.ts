import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import getAuth from "@/hooks/server/getAuth";

export async function POST(request: NextRequest) {
  const { user } = await getAuth();

  if (user == null) {
    return NextResponse.json(
      {
        status: "UNAUTHORIZED",
      },
      {
        status: 401,
      },
    );
  }

  const payload = (await request.json()) as {
    pdfName: string;
    pdfUrl: string;
    fileKey: string;
  };
  const authToken = cookies().get("auth-token")?.value!;

  const createChatRequest = await fetch(
    process.env.PDFQA_BACKEND! + "/chats/create",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        pdf_name: payload.pdfName,
        pdf_url: payload.pdfUrl,
        file_key: payload.fileKey,
      }),
    },
  );

  const createChatResponse = (await createChatRequest.json()) as {
    id?: string;
  };

  if ("id" in createChatResponse) {
    return NextResponse.json(
      {
        status: "OK",
        chatId: createChatResponse.id,
      },
      {
        status: 200,
      },
    );
  }

  return NextResponse.json(
    {
      status: "ERROR",
    },
    {
      status: 200,
    },
  );
}
