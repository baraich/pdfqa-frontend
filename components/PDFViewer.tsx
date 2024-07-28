"use client";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

type PDFViewerProps = {
  fileUrl: string;
};

export default function PDFViewer(props: PDFViewerProps) {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      {/* @ts-ignore */}
      <Viewer scrollMode={"Vertical"} fileUrl={props.fileUrl} />
    </Worker>
  );
}
