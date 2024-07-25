"use client";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormEvent, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      let _message = message;
      setMessage("");

      setMessages((messages) => [
        ...messages,
        {
          id: v4(),
          role: "user",
          content: _message,
        },
      ]);

      const request = await fetch("/api/message", {
        method: "POST",
        cache: "no-cache",
        body: JSON.stringify({
          message: _message,
          chatId: props.chatId,
        }),
      });

      if (!request.body) {
        setLoading(false);
        toast.error(
          "Error occurred while loading the message, try again later!",
        );
        return;
      }

      const reader = request.body.getReader();
      const messageId = v4();

      const decode = new TextDecoder();
      setMessages((messages) => [
        ...messages,
        {
          content: "",
          id: messageId,
          role: "assistant",
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setLoading(false);
          if (messagesContainerRef.current != null) {
            messagesContainerRef.current.scrollTo({
              top: messagesContainerRef.current.scrollHeight,
            });
          }

          break;
        } else {
          if (messagesContainerRef.current != null) {
            messagesContainerRef.current.scrollTo({
              top: messagesContainerRef.current.scrollHeight,
            });
          }

          setMessages((messages) =>
            messages.map((message) => {
              if (message.id === messageId) {
                const rawMessage = `{"status": "OK", "completion": "${message.content}${decode.decode(value)}`;

                const fixed = JSON.parse(jsonrepair(rawMessage)) as {
                  status: "OK";
                  completion: string;
                };

                message.content = fixed.completion;
              }

              return message;
            }),
          );
        }
      }
    } catch (error) {
      setMessages((messages) => messages.slice(0, messages.length - 1));

      setLoading(false);
      console.log(error);

      toast.error(
        "An error occurred while sending the message, please try again later!.",
        {
          richColors: true,
        },
      );
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
        {messages.map((message, idx) => (
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
          <Button variant={"default"} disabled={loading}>
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
