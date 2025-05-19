"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, type File } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { ImageViewer } from "@/components/image-viewer"

interface FileUploaderProps {
  onFileChange: (file: File | null) => void
  fileUrl: string | null
}

export function FileUploader({ onFileChange, fileUrl }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0])
      }
    },
    [onFileChange],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => setIsDragging(false),
  })

  return (
    <div className="h-full flex flex-col">
      {!fileUrl ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg h-full flex flex-col items-center justify-center p-6 transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50",
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 text-center mb-1">画像をドラッグ＆ドロップ</p>
          <p className="text-xs text-gray-500 text-center">または、クリックして画像を選択</p>
          <p className="text-xs text-gray-400 mt-2">対応形式: JPG, PNG</p>
        </div>
      ) : (
        <Card className="h-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-2">
            <ImageViewer src={fileUrl || "/placeholder.svg"} alt="アップロードされた画像" />
          </div>
          <div className="p-2 border-t flex justify-between items-center">
            <span className="text-sm text-gray-600 truncate">画像を読み込みました</span>
            <button onClick={() => onFileChange(null)} className="text-xs text-red-500 hover:text-red-700">
              削除
            </button>
          </div>
        </Card>
      )}
    </div>
  )
}
