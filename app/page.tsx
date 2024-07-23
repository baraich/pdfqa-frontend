import {LoggedIn, LoggedOut} from "@/providers/SessionProvider";
import {Button} from "@/components/ui/button";
import {LogIn} from "lucide-react";
import Link from "next/link";
import {useDropzone} from "react-dropzone";
import FileUpload from "@/components/FileUpload";

export default function LandingPage() {
  return (
    <div className={"w-screen h-screen from-indigo-100 to-pink-100 bg-gradient-to-r grid place-items-center"}>
      <LoggedOut>
        <div className={"absolute top-8 right-8"}>
          <Link href={"/signin"}>
            <Button className={"flex gap-1"}>
              <span>Login</span>
              <LogIn className={"size-4"}/>
            </Button>
          </Link>
        </div>
      </LoggedOut>

      <div className={"max-w-xl w-full m-4 flex flex-col items-center gap-4"}>
        <h2 className={"font-bold text-5xl text-center"}>Converse with any PDF</h2>
        <p className={"text-md text-center"}>Join millions of students, teachers and researches using AI to understand
          and answer questions instantly.</p>

        <LoggedOut>
          <Link href={"/signin"}>
            <Button className={"flex gap-1"}>
              <span>Get Answers</span>
              <LogIn className={"size-4"}/>
            </Button>
          </Link>
        </LoggedOut>

        <LoggedIn>
          <div className={"max-w-xl w-full m-4 p-2 bg-white rounded-2xl"}>
            <FileUpload />
          </div>
        </LoggedIn>
      </div>
    </div>
  )
}