"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import React, { FormEvent } from "react";
import {toast} from "sonner";

export default function SignIn() {
  const [detail, setDetail] = React.useState<string>("");

  const handleLogin = async function (event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const payload = Object.fromEntries(formData);

    try {
      const request = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = (await request.json()) as
        | { status: "OK" | "ERROR" }
        | { detail: string };

      if ("detail" in responseData) {
        return setDetail(responseData?.detail as string);
      }

      if (responseData.status === "ERROR") {
        toast.error("An error has occurred, please try again later!");
      }

      if (responseData.status === "OK") {
        toast.success("Successfully logged in!");

        if (global.window !== undefined) {
          global.window.location.pathname = "/";
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={
        "w-screen bg-gray-100 h-screen overflow-hidden grid place-items-center"
      }
    >
      <div
        className={
          "bg-white max-w-xl m-4 p-4 rounded-md shadow flex flex-col gap-2"
        }
      >
        <h2>Login</h2>
        <form onSubmit={handleLogin} className={"flex flex-col gap-2"}>
          <input
            className={
              "p-2 px-3 focus:ring-4 outline-none focus:ring-indigo-100 rounded border"
            }
            type="text"
            name={"username"}
            placeholder={"Username"}
          />

          {detail !== "" ? <p className={"text-xs text-red-500"}>{detail}</p> : null}

          <input
            className={
              "p-2 px-3 focus:ring-4 outline-none focus:ring-indigo-100 rounded border"
            }
            type="password"
            name={"password"}
            placeholder={"********"}
          />
          <Button className={"flex gap-1"}>
            <span>Login</span>
            <ArrowUpRight className={"size-4"} />
          </Button>
        </form>
      </div>
    </div>
  );
}
