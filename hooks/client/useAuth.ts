import {SessionContext} from "@/providers/SessionProvider";
import {useContext} from "react";

export default function useAuth() {
  if (SessionContext === undefined) {
    throw new Error("useAuth can only be used inside SessionProvider");
  }

  return useContext(SessionContext).user;
}