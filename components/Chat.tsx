"use client";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { jsonrepair } from "jsonrepair";
import { v4 } from "uuid";

type ChatProps = {
  chatId: string;
};

export default function Chat(props: ChatProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; id: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  const [assistantMessageId, setAssistantMessageId] = useState<string | null>(
    null,
  );
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (socket) return;

    setSocket(
      new WebSocket(
        `${process.env.NEXT_PUBLIC_PDFQA_WEBSOCKET}/${props.chatId}`,
      ),
    );
  }, []);

  const onMessage = useCallback(
    (data: string) => {
      setLoading(false);

      if (!assistantMessageId) return;
      if (!messagesContainerRef.current) return;

      setMessages((messages) =>
        messages.map((message) => {
          if (message.id === assistantMessageId) {
            return { ...message, content: message.content + data };
          }

          return message;
        }),
      );

      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    },
    [messagesContainerRef, assistantMessageId],
  );

  useEffect(() => {
    if (!socket) return;

    socket.onopen = function () {
      setLoading(false);
      setConnected(true);
    };

    socket.onmessage = ({ data }) => onMessage(data);

    return () => {
      // Clean up the event listeners when the component unmounts
      socket.onopen = null;
      socket.onmessage = null;
    };
  }, [socket, onMessage]);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (socket) {
      let assistantMessageId = v4();
      setAssistantMessageId(assistantMessageId);

      setMessages((messages) => [
        ...messages,
        {
          id: v4(),
          role: "user",
          content: message,
        },
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
        },
      ]);

      socket.send(message);
      setMessage("");
    } else {
      toast.error("An error occurred, please try again later!", {
        richColors: true,
      });
    }
  };

  return (
    <div
      className={"max-h-screen h-screen grid grid-rows-[1fr_auto] grid-cols-1"}
    >
      <div
        className={"p-4 flex flex-col gap-4 overflow-auto"}
        ref={messagesContainerRef}
      >
        {messages
          .filter((message) => !!message.content)
          .map((message, idx) => (
            <div
              key={idx}
              className={cn("p-4 max-w-[70%] rounded", {
                "self-end bg-orange-300": message.role === "user",
                "bg-stone-200 self-start": message.role === "assistant",
              })}
            >
              {message.content}
            </div>
          ))}
      </div>

      <div className={"p-4 border-t"}>
        <form
          onSubmit={sendMessage}
          className={"gap-2 flex items-center justify-between"}
        >
          <Input
            type={"text"}
            value={message}
            autoFocus={true}
            placeholder={"Enter your question..."}
            onChange={(event) => setMessage(event.target.value)}
          />
          <Button variant={"default"} disabled={loading || !connected}>
            {loading ? (
              <Loader2 className={"animate-spin size-4 text-white"} />
            ) : (
              <Send className={"size-4"} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
