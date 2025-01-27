import { useRef, useState } from "react";
import { MemoizedMarkdown } from "./components/memo-markdown";
import FileUploadForm from "./components/file-upload-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import Hero from "./components/home";

export default function Page() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!files || files.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // Append each file to the FormData object
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/submit`,
        {
          method: "POST",
          body: formData,
        }
      );

      // Handle the streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        console.log("no reader found");
        return;
      }
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Process the chunk of data
        const chunk = decoder.decode(value);
        result += chunk;
        // Update the state with the received data
        setMessages(result);
      }

      console.log("Stream complete");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setIsLoading(false);
      setFiles(null); // Clear the selected files
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Hero />
        <FileUploadForm
          onSubmit={submit}
          setFiles={setFiles}
          isLoading={isLoading}
        />

        {/* Preview Section */}
        {files && files.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>File Preview</CardTitle>
              <CardDescription>Preview of the selected file(s)</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
              <ul className="overflow-auto max-h-64">
                {Array.from(files).map((file, index) => (
                  <li key={index} className="mb-2">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="max-w-full h-auto"
                      />
                    ) : (
                      file.name
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Analysis Section */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Analysis</CardTitle>
            <CardDescription>Results from your uploaded label</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6">
            {messages ? (
              <MemoizedMarkdown content={messages} />
            ) : isLoading ? (
              <div className="h-56 w-auto grid place-items-center">
                <div className="w-auto flex flex-col items-center justify-center">
                  <img
                    src="/test-tube-icon.gif"
                    alt="Analysis in progress"
                    className="h-12 w-12"
                  />
                  <p className="text-lg text-muted-foreground">
                    Analyzing the contents...
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
