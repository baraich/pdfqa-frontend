import { cookies } from "next/headers";
import PDFViewer from "@/components/PDFViewer";
import Chat from "@/components/Chat";

type ChatProps = {
  params: {
    chatId: string;
  };
};

export default async function ChatPage(props: ChatProps) {
  const authToken = cookies().get("auth-token")?.value!;

  const chatRequest = await fetch(
    process.env.PDFQA_BACKEND + "/chats/" + +props.params.chatId,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  const chat = (await chatRequest.json()) as {
    id: number;
    pdf_url: string;
    pdf_name: string;
  };

  return (
    <div
      className={"w-full h-screen overflow-hidden grid grid-cols-1 grid-rows-[3fr_5fr] md:grid-rows-1 md:grid-cols-[3fr_2fr]"}
    >
      <div className={"overflow-hidden py-8 bg-white"}>
        <PDFViewer fileUrl={chat.pdf_url} />
      </div>
      <Chat chatId={props.params.chatId} />
    </div>
  );
}
