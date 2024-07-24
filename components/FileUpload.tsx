"use client";

import { useDropzone } from "react-dropzone";
import { FileUp } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {useRouter} from "next/navigation";

export default function FileUpload() {
  const router = useRouter();

  async function isPDF(file: File): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = (evt) => {
        if (evt.target?.readyState === FileReader.DONE) {
          const arr = new Uint8Array(evt.target.result as ArrayBuffer).subarray(0, 4);
          let header = "";
          arr.forEach((byte) => {
            header += byte.toString(16);
          });

          // Check for PDF magic number
          if (header === "25504446") {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      // Read first 4 bytes
      const blob = file.slice(0, 4);
      reader.readAsArrayBuffer(blob);
    });
  }

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (!(await isPDF(file))) {
        return toast.warning("Only PDF files are supported!", {
          richColors: true
        });
      }

      if (file.size > 10 * 1024 * 1024) {
        return toast.error("Cannot upload a file greater than 10MB!", {
          richColors: true
        });
      }

      toast.info("Getting the signed URL to upload the files.");

      const signedUrlRequest = await fetch("/api/storage/sign-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: file.name }),
      });

      const signedUrlResponse = (await signedUrlRequest.json()) as {
        fileKey: string;
        signedUrl: string;
      };

      toast.info("Initiating the process to upload the file!");

      const formData = new FormData();
      formData.append("file", file);

      await axios.put(signedUrlResponse.signedUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          toast.info(`Uploading (${event.loaded * 100 / event.total!}%)`)
        },
      });

      axios.post("/api/create-chat", {
        pdfName: file.name,
        fileKey: signedUrlResponse.fileKey,
        pdfUrl: new URL(signedUrlResponse.signedUrl).origin + "/" + signedUrlResponse.fileKey
      }).then((response) => {
        if (response.data.status === "OK") {
          toast.info("File uploaded successfully!");

          router.push("/chats/" + response.data.chatId);
        } else {
          toast.warning("An error has occurred, please try again later!", {
            richColors: true
          });
        }
      });
    },
  });

  return (
    <div
      {...getRootProps({
        className:
          "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
      })}
    >
      <input {...getInputProps()} />

      <div className={"flex gap-2 justify-center flex-col items-center"}>
        <FileUp className={"text-indigo-500 size-8"} />
        <p>Drop your PDF here!</p>
      </div>
    </div>
  );
}
