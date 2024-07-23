import { SessionContextProps } from "@/providers/SessionProvider";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function getAuth(): Promise<SessionContextProps> {
  const authToken = cookies().get("auth-token")?.value;
  if (!authToken) {
    return {
      user: null,
    };
  }

  try {
    const request = await fetch(process.env.PDFQA_BACKEND + "/me", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const responseData = (await request.json()) as
      | {
          code: string;
        }
      | { id: string; email: string };

    if ("code" in responseData) {
      // Means the access token as expired
      if (responseData.code === "token_not_valid") {
        return redirect("/api/logout");
      }

      return {
        user: null,
      };
    }

    return {
      user: {
        id: +responseData.id,
        email: responseData.email,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      user: null,
    };
  }
}
