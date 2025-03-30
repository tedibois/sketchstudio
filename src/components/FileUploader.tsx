
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

type FileUploaderProps = {
  onUpload: (file: File) => void;
  onClear: () => void;
  preview?: string;
  accept?: string;
  maxSize?: number; // in bytes
};

const FileUploader = ({
  onUpload,
  onClear,
  preview,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.match(accept.replace('*', ''))) {
      toast.error(`Invalid file type. Please upload ${accept.replace('*', '')} files.`);
      return;
    }
    
    // Validate file size
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
      return;
    }
    
    onUpload(file);
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative border border-border rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-[300px] object-contain"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full w-8 h-8"
            onClick={onClear}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          } transition-colors cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={accept}
          />
          <Upload
            className="mx-auto h-12 w-12 text-muted-foreground mb-4"
            strokeWidth={1.5}
          />
          <p className="text-lg font-medium mb-1">Drag & drop or click to upload</p>
          <p className="text-sm text-muted-foreground mb-4">
            Supported formats: JPG, PNG, GIF, SVG
          </p>
          <p className="text-xs text-muted-foreground">
            Max file size: {maxSize / (1024 * 1024)}MB
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
