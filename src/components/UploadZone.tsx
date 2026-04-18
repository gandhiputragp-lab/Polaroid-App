import React, { useRef, useState, useCallback } from "react"
import { Upload, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface UploadZoneProps {
  onImageLoad: (img: HTMLImageElement) => void
}

export function UploadZone({ onImageLoad }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        toast.error("Format tidak didukung. Gunakan JPG, PNG, atau WEBP.")
        return
      }
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        const isLandscape = img.naturalWidth > img.naturalHeight
        if (isLandscape) {
          toast.info("Foto dirotasi ke portrait")
        }
        onImageLoad(img)
      }
      img.src = url
    },
    [onImageLoad]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors",
        isDragging
          ? "border-primary bg-accent/40"
          : "border-border bg-muted/30 hover:border-primary/50 hover:bg-accent/20"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        {isDragging ? (
          <ImageIcon className="h-8 w-8 text-primary" />
        ) : (
          <Upload className="h-8 w-8 text-primary" />
        )}
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">
          {isDragging ? "Lepas foto di sini" : "Upload Foto Pernikahan"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Seret & lepas, atau klik untuk memilih
        </p>
        <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  )
}
