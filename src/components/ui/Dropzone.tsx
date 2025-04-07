import Image from "next/image";
import { useDropzone } from "react-dropzone";

export default function Dropzone({
  onFileAccepted,
  preview,
  disabled,
}: {
  onFileAccepted: (file: File) => void;
  preview?: string;
  disabled?: boolean;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file) {
          onFileAccepted(file);
        }
      }
    },
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    disabled,
  });
  return (
    <div
      {...getRootProps()}
      className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted transition-colors dark:hover:bg-muted"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here...</p>
      ) : (
        <p>Drag & drop a photo here, or click to select one</p>
      )}
      {preview && (
        <div className="mt-2 mx-auto h-20 w-20 relative rounded-full border">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded-full"
          />
        </div>
      )}
    </div>
  );
}
