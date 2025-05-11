import React, { FC, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
}

export const MediaUploader: FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
      'video/*': []
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        progress: 0
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer"
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop files here, or click to select files
        </p>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center space-x-4 rounded-lg border p-4"
          >
            <div className="h-16 w-16 flex-shrink-0">
              {file.file.type.startsWith('image/') ? (
                <img
                  src={file.preview}
                  alt=""
                  className="h-full w-full object-cover rounded"
                />
              ) : (
                <video
                  src={file.preview}
                  className="h-full w-full object-cover rounded"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.file.name}</p>
              <Progress value={file.progress} className="mt-2" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFile(file.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}; 