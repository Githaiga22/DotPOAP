import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, X, Image, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PoapDesignUploadProps {
  onImageSelect?: (file: File, preview: string) => void;
  onImageRemove?: () => void;
  className?: string;
  maxSize?: number; // in MB
}

export const PoapDesignUpload: React.FC<PoapDesignUploadProps> = ({
  onImageSelect,
  onImageRemove,
  className,
  maxSize = 5
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a PNG, JPG, JPEG, or SVG file';
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSize}MB`;
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setPreview(previewUrl);
      onImageSelect?.(file, previewUrl);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect, maxSize]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    onImageRemove?.();
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          POAP Design Upload
        </CardTitle>
        <CardDescription>
          Upload your custom POAP design. This will be the visual representation of your event.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Design Guidelines */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Design Guidelines:</strong> 500x500px recommended, high contrast, clear text, recognizable at small sizes
          </AlertDescription>
        </Alert>

        {/* Upload Area */}
        {!selectedFile ? (
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              "hover:border-primary hover:bg-primary/5 cursor-pointer"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              
              <div>
                <p className="text-lg font-medium">Drop your POAP design here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">PNG</Badge>
                <Badge variant="secondary">JPG</Badge>
                <Badge variant="secondary">SVG</Badge>
                <Badge variant="secondary">Max {maxSize}MB</Badge>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Area */
          <div className="space-y-4">
            <div className="relative">
              <div className="aspect-square w-full max-w-xs mx-auto rounded-lg overflow-hidden border border-border">
                <img
                  src={preview!}
                  alt="POAP Design Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Design uploaded successfully</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p><strong>File:</strong> {selectedFile.name}</p>
                <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Type:</strong> {selectedFile.type}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Design Tips */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Design Tips:</Label>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use high contrast colors for better visibility</li>
            <li>• Include event name and date</li>
            <li>• Avoid small text that may be hard to read</li>
            <li>• Consider how the design looks at small sizes</li>
            <li>• Use your brand colors and logo if applicable</li>
          </ul>
        </div>

        {/* Action Buttons */}
        {selectedFile && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRemove} className="flex-1">
              Remove Design
            </Button>
            <Button 
              onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
              className="flex-1"
            >
              Change Design
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
