"use client"

import { useState } from "react"
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageViewerProps {
  src: string
  alt?: string
}

export function ImageViewer({ src, alt = "アップロードされた画像" }: ImageViewerProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5))
  }

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-auto flex items-center justify-center p-2">
        <div
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: "transform 0.2s ease-in-out",
          }}
          className="origin-center"
        >
          <img src={src || "/placeholder.svg"} alt={alt} className="max-w-full h-auto object-contain" />
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button variant="outline" size="icon" onClick={zoomOut} title="縮小">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={zoomIn} title="拡大">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={rotate} title="回転">
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
