"use client";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { v4 } from "uuid";
import axios from "axios";
import renderLinks from "@/lib/renderLinks";

type ChatProps = {
  chatId: string;
};

export default function Chat(props: ChatProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; message: string; id: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [initialMessages, setInitialMessages] = useState<typeof messages>([]);

  const [assistantMessageId, setAssistantMessageId] = useState<string | null>(
    null,
  );
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    try {
      const messages = axios.post(`/api/messages`, {
        chatId: props.chatId,
      });

      messages.then(({ data }) =>
        Array.isArray(data)
          ? setInitialMessages(data)
          : toast.error(
              "An occurred while fetching previous messages, please try again later!",
              {
                richColors: true,
              },
            ),
      );
    } catch (error) {
      toast.error(
        "An error occurred while fetching previous messages from the server.",
        {
          richColors: true,
        },
      );
    }
  }, []);

  useEffect(() => {
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
            return { ...message, message: message.message + data };
          }

          return message;
        }),
      );
    },
    [messagesContainerRef, assistantMessageId],
  );

  useEffect(() => {
    if (!socket) return;

    socket.onopen = function () {
      setLoading(false);
      setConnected(true);
    };

    socket.onclose = function () {
      toast.error(
        "You have been disconnected, refresh the page or try again later!",
        {
          richColors: true,
        },
      );
    };

    socket.onmessage = ({ data }) => onMessage(data);

    return () => {
      // Clean up the event listeners when the component unmounts
      socket.onopen = null;
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
          message: message,
        },
        {
          id: assistantMessageId,
          role: "assistant",
          message: "",
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

  useEffect(() => {
    if (messagesContainerRef.current == null) return;

    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messagesContainerRef, messages, initialMessages]);

  return (
    <div
      className={"max-h-screen h-full grid grid-rows-[1fr_auto] grid-cols-1"}
    >
      <div
        className={"p-4 flex flex-col-reverse gap-4 break-words overflow-auto"}
        ref={messagesContainerRef}
      >
        {[...initialMessages, ...messages]
          .reverse()
          .filter((message) => !!message.message)
          .map((message, idx) => (
            <div
              key={idx}
              className={cn("p-4 max-w-[70%] rounded", {
                "self-end bg-orange-300": message.role === "user",
                "bg-stone-200 self-start": message.role === "assistant",
              })}
            >
              {renderLinks(message.message)
                .filter((block) => !!block)
                .map((block, idx) =>
                  block.type === "link" ? (
                    <a key={idx} className={"text-black underline"} href={block.content as string}>{block.content}</a>
                  ) : (
                    <span key={idx}>{block.content}</span>
                  ),
                )}
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
