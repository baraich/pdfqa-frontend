"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cross, Menu, MessageSquarePlus, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SidebarProps = {
  chats: { id: number; pdf_url: string; pdf_name: string }[];
};

export default function Sidebar({ chats }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openMenu = () => {
    setSidebarOpen(true);
  };

  return (
    <div className={"h-screen"}>
      <div
        className={
          "absolute md:hidden right-3 top-3 bg-orange-400 p-1.5 rounded z-30 cursor-pointer"
        }
        onClick={openMenu}
      >
        <X className={"size-5 text-white"} />
      </div>

      <div
        className={cn(
          "bg-stone-800 p-4 pt-8 h-full md:relative absolute md:top-auto md:left-auto md:bottom-auto top-0 bottom-0 right-0 w-full z-50 md:max-w-[300px] md:w-[300px]",
          sidebarOpen ? "left-0" : "-left-full"
        )}
      >
        <div className={"w-full flex items-center justify-between"}>
          <h2
            className={
              "text-white font-bold pb-2 text-2xl border-b-2 border-dashed"
            }
            style={{ borderColor: "#FFFFFF50" }}
          >
            Chats
          </h2>

          <Link href={"/"}>
            <Button className={"bg-orange-300 hover:bg-orange-200"}>
              <MessageSquarePlus className={"size-4 text-black"} />
            </Button>
          </Link>
        </div>

        <div className={"h-full py-8 flex gap-2 flex-col w-full"}>
          {chats.map((chat) => (
            <div
              data-chat-id={chat.id}
              suppressHydrationWarning={true}
              className={"p-4 truncate w-full bg-orange-300 rounded"}
              key={chat.id}
            >
              <a href={`/chats/${chat.id}`}>{chat.pdf_name}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
