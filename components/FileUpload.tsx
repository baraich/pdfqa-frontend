"use client";

import { useDropzone } from "react-dropzone";
import { FileUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function FileUpload() {
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file.size > 10 * 1024 * 1024) {
        return toast.error("Cannot upload a file greater than 10MB!");
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
          console.log(event);
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
