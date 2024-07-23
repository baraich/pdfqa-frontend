import { Mails } from "lucide-react";

export default async function ChatsPage() {
  return (
    <div
      className={
        "flex gap-3 flex-col items-center shadow-sm bg-white p-4 rounded"
      }
    >
      <Mails className={"text-orange-300 size-10"} />
      <p>No Chat Selected!</p>
    </div>
  );
}
