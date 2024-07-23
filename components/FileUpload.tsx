"use client";

import {useDropzone} from "react-dropzone";
import {FileUp} from "lucide-react";

export default function FileUpload() {
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles)
    }
  });

  return (
    <div {...getRootProps({
      className: "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col"
    })}>
      <input {...getInputProps()} />

      <div className={"flex gap-2 justify-center flex-col items-center"}>
        <FileUp className={"text-indigo-500 size-8"} />
        <p>Drop your PDF here!</p>
      </div>
    </div>
  )
}