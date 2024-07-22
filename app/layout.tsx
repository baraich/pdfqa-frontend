import "./globals.css";
import {DM_Sans} from "next/font/google";
import SessionProvider from "@/providers/SessionProvider";

type RootLayoutProps = {
  children: React.ReactNode
}

const fontFamily = DM_Sans({
  subsets: ["latin"]
})

export default function RootLayout(props: RootLayoutProps) {
  return (
    <SessionProvider>
      <html lang={"en"}>
        <body className={fontFamily.className}>
          {props.children}
        </body>
      </html>
    </SessionProvider>
  )
}