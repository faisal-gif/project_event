"use client"
import { useState, useRef } from "react"
import { Upload, Image, X } from "lucide-react"

export const FileUpload = ({ name = "thumbnail", onChange }) => {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (f) => {
    if (f.type.startsWith("image/")) {
      setFile(f)
      if (onChange) onChange(f) // biar masuk ke useForm Laravel Inertia
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result)
      }
      reader.readAsDataURL(f)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    if (onChange) onChange(null)
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative group">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-gradient-accent border-2 border-dashed border-primary/20">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
          <button
            type="button"
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removeFile}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="mt-3 text-sm text-muted-foreground text-center">
            {file?.name}
          </div>
        </div>
      ) : (
        <div
          className={`aspect-video w-full rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
            ${
              dragActive
                ? "border-primary bg-gradient-accent scale-105"
                : "border-muted-foreground/30 bg-secondary/30 hover:border-primary/50 hover:bg-gradient-accent"
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
            <div
              className={`p-4 rounded-full transition-all duration-300 ${
                dragActive ? "bg-primary/20 scale-110" : "bg-primary/10"
              }`}
            >
              {dragActive ? (
                <Upload className="w-8 h-8 text-primary animate-bounce" />
              ) : (
                <Image className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium text-foreground">
                {dragActive ? "Drop your image here" : "Upload event thumbnail"}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
