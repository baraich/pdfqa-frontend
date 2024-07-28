import { ReactNode } from "react";
import getAuth from "@/hooks/server/getAuth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface ChatWrapperProps {
  children: ReactNode;
}

export default async function ChatWrapperLayout(props: ChatWrapperProps) {
  const { user } = await getAuth();

  if (user === null) {
    return redirect("/");
  }

  const authToken = cookies().get("auth-token")?.value!;
  const chats = (await (
    await fetch(process.env.PDFQA_BACKEND + "/chats", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      next: {
        tags: ["fetch-user-chats"],
      },
      cache: "force-cache"
    })
  ).json()) as { id: number; pdf_url: string; pdf_name: string }[];

  return (
    <div
      className={"grid grid-cols-[auto_1fr] w-screen h-screen overflow-hidden"}
    >
      <Sidebar chats={chats} />
      <div className={"grid place-items-center bg-gray-100"}>
        {props.children}
      </div>
    </div>
  );
}
