import "./globals.css";
import { DM_Sans } from "next/font/google";
import SessionProvider from "@/providers/SessionProvider";
import { Toaster } from "sonner";
import getAuth from "@/hooks/server/getAuth";
import NextTopLoader from "nextjs-toploader";
import {cn} from "@/lib/utils";

type RootLayoutProps = {
  children: React.ReactNode;
};

const fontFamily = DM_Sans({
  subsets: ["latin"],
});

export default async function RootLayout(props: RootLayoutProps) {
  const auth = await getAuth();

  return (
    <SessionProvider auth={auth}>
      <html lang={"en"}>
        <body className={cn(fontFamily.className, "overflow-hidden")}>
          <NextTopLoader color={"#818cf8"} />
          <Toaster className={fontFamily.className} />
          {props.children}
        </body>
      </html>
    </SessionProvider>
  );
}
