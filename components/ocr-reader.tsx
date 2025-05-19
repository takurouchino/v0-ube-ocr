"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileUploader } from "@/components/file-uploader"
import { OcrResultDisplay } from "@/components/ocr-result-display"
import { processImageWithOcr } from "@/lib/ocr-service"
import type { InspectionData } from "@/types/inspection-data"

// Import the useToast hook
import { useToast } from "@/hooks/use-toast"

// Add the toast hook to the component
export function OcrReader() {
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrResult, setOcrResult] = useState<InspectionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Update the handleProcessOcr function to use toast
  const handleFileChange = (file: File | null) => {
    setFile(file)
    setError(null)
    if (file) {
      const url = URL.createObjectURL(file)
      setFileUrl(url)
    } else {
      setFileUrl(null)
    }
    setOcrResult(null)
  }

  const handleProcessOcr = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)

    try {
      const result = await processImageWithOcr(file)
      setOcrResult(result)
      toast({
        title: "OCR処理完了",
        description: "画像の読み取りが完了しました。",
      })
    } catch (error) {
      console.error("OCR処理中にエラーが発生しました:", error)
      // エラーメッセージを表示
      const errorMessage = error instanceof Error ? error.message : "不明なエラーが発生しました"
      setError(errorMessage)
      toast({
        title: "エラー",
        description: `OCR処理中にエラーが発生しました`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-full">
      {/* 中央のインプットエリア (3/7) */}
      <div className="w-[calc(100%*3/7)] border-r p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">画像読み込み</h2>
        <div className="flex-1 overflow-auto">
          <FileUploader onFileChange={handleFileChange} fileUrl={fileUrl} />
        </div>
        <div className="mt-4 flex flex-col">
          {error && <div className="mb-2 text-sm text-red-500 bg-red-50 p-2 rounded">{error}</div>}
          <div className="flex justify-end">
            <Button onClick={handleProcessOcr} disabled={!file || isProcessing}>
              {isProcessing ? "処理中..." : "読み取り開始"}
            </Button>
          </div>
        </div>
      </div>

      {/* 右側の出力エリア (4/7) */}
      <div className="w-[calc(100%*4/7)] p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">読み取り結果</h2>
        <div className="flex-1 overflow-auto">
          <OcrResultDisplay data={ocrResult} />
        </div>
      </div>
    </div>
  )
}
