"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Loader2 } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = React.useState<string>("");

  const handleLogin = async function (event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const payload = Object.fromEntries(formData);

    try {
      setLoading(true);
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
      setLoading(false);

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
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div
      className={"w-screen h-screen overflow-hidden grid place-items-center"}
    >
      <Card className="max-w-sm mx-8">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name={"username"}
                type="text"
                placeholder="admin"
                required
              />
              {detail ? (
                <span className={"text-rose-500 text-xs"}>{detail}</span>
              ) : null}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name={"password"}
                type="password"
                placeholder={"********"}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {loading ? (
                <Loader2 className={"animate-spin text-white size-4"} />
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
