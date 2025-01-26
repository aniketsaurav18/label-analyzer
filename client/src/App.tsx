import { useRef, useState } from "react";
import axios from "axios";
import { MemoizedMarkdown } from "./components/memo-markdown";

export default function Page() {
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

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
      setFiles(undefined); // Clear the selected files
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
    }
  };

  return (
    <div>
      <div>
        <MemoizedMarkdown content={messages} />
      </div>

      <form onSubmit={submit}>
        <input
          type="file"
          onChange={(event) => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
        <input
          value={input}
          placeholder="Send message..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
