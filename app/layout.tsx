import "./globals.css";
import { DM_Sans } from "next/font/google";
import SessionProvider from "@/providers/SessionProvider";
import { Toaster } from "sonner";
import getAuth from "@/hooks/server/getAuth";

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
        <body className={fontFamily.className}>
          <Toaster />
          {props.children}
        </body>
      </html>
    </SessionProvider>
  );
}
