"use client"

import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { motion } from "framer-motion"
import { Upload, Loader2, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ModernUploadFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  input: string
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isLoading: boolean
  setFiles: (files: FileList) => void
}

export default function ModernUploadForm({
  onSubmit,
  input,
  handleInputChange,
  isLoading,
  setFiles,
}: ModernUploadFormProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [previewFiles, setPreviewFiles] = useState<File[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        setPreviewFiles(acceptedFiles) // Update preview files
        const fileList = Object.assign(acceptedFiles, {
          item: (index: number) => acceptedFiles[index],
          length: acceptedFiles.length,
        }) as unknown as FileList
        setFiles(fileList)
      }
    },
    [setFiles],
  )

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Allow only images for this example
  })

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        {/* File Upload Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
            isDragAccept
              ? "border-green-500 bg-green-50"
              : isDragReject
              ? "border-red-500 bg-red-50"
              : isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Drag & drop files here, or click to select files</p>
          </div>
        </div>

        {/* File Preview Panel */}
        {previewFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">File Preview:</h3>
            <ul className="space-y-2">
              {previewFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between text-sm text-gray-600">
                  <span>{file.name}</span>
                  <Trash
                    className="h-4 w-4 text-gray-500 cursor-pointer"
                    onClick={() =>
                      setPreviewFiles(prev => prev.filter((_, i) => i !== index))
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Input and Submit Button */}
        <div className="flex space-x-2">
          <Input
            value={input}
            placeholder="Send message..."
            onChange={handleInputChange}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
