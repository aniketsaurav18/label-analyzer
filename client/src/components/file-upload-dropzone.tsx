import { Card, CardContent } from "./ui/card";
import { Loader2, Upload } from "lucide-react";
import { Button } from "./ui/button";
// import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ModernUploadFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  setFiles: (files: FileList) => void;
}

const FileUploadForm = ({
  onSubmit,
  isLoading,
  setFiles,
}: ModernUploadFormProps) => {
  const [isDragActive, _setIsDragActive] = useState(false);
  // const [previewFiles, setPreviewFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        // setPreviewFiles(acceptedFiles);
        const fileList = Object.assign(acceptedFiles, {
          item: (index: number) => acceptedFiles[index],
          length: acceptedFiles.length,
        }) as unknown as FileList;
        setFiles(fileList);
      }
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "image/*": [] }, // Allow only images for this example
    });
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg transition-all duration-150 ease-in-out p-6 text-center ${
              isDragAccept
                ? "border-green-500 bg-green-50"
                : isDragReject
                ? "border-red-500 bg-red-50"
                : isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-primary/50 hover:bg-accent/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">
                Drop your files here
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse
              </p>
              <Button variant="secondary" size="sm">
                Choose Files
              </Button>
            </div>
          </div>

          {/* <ScrollArea className="h-[100px] w-full rounded-md border p-4">
            {previewFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  File Preview:
                </h3>
                <ul className="space-y-2">
                  {previewFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-sm text-gray-600"
                    >
                      <span>{file.name}</span>
                      <Trash
                        className="h-4 w-4 text-gray-500 cursor-pointer"
                        onClick={() =>
                          setPreviewFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ScrollArea> */}

          <div className="mt-6">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Analyze Label"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FileUploadForm;
