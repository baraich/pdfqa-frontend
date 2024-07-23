import { ReactNode } from "react";
import getAuth from "@/hooks/server/getAuth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import axios from "axios";
import Link from "next/link";

interface ChatWrapperProps {
  children: ReactNode;
}

export default async function ChatWrapperLayout(props: ChatWrapperProps) {
  const { user } = await getAuth();

  if (user === null) {
    return redirect("/");
  }

  const authToken = cookies().get("auth-token")?.value!;
  const chats = (
    await axios.get(process.env.PDFQA_BACKEND + "/chats", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
  ).data as { id: number; pdf_url: string; pdf_name: string }[];

  return (
    <div
      className={"grid grid-cols-[300px_1fr] w-screen h-screen overflow-hidden"}
    >
      <div className={"bg-stone-800 p-4 pt-8"}>
        <h2
          className={
            "text-white font-bold pb-2 text-2xl border-b-2 border-dashed"
          }
          style={{ borderColor: "#FFFFFF50" }}
        >
          Chats
        </h2>

        <div className={"h-full py-8 flex gap-2 flex-col w-full"}>
          {chats.map((chat) => (
            <div
              data-chat-id={chat.id}
              suppressHydrationWarning={true}
              className={"p-4 truncate w-full bg-orange-300 rounded"}
              key={chat.id}
            >
              <Link href={`/chats/${chat.id}`}>{chat.pdf_name}</Link>
            </div>
          ))}
        </div>
      </div>
      <div className={"grid place-items-center bg-gray-100"}>
        {props.children}
      </div>
    </div>
  );
}
