import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Camera,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploadProps } from './ImageUpload.types';

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label,
  helperText = 'PNG, JPG, WEBP or GIF (Max 10MB)',
  variant = 'thumbnail',
  className = '',
  disabled = false,
  required = false,
  maxSizeMb = 10,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type. Please upload an image file.');
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`Image exceeds ${maxSizeMb}MB maximum limit.`);
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
      setIsProcessing(false);
      toast.success('Image uploaded successfully!');
    };
    reader.onerror = () => {
      setIsProcessing(false);
      toast.error('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerUpload = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Avatar Variant (Round / Squircle)
  if (variant === 'avatar') {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>{label} {required && <span className="text-destructive">*</span>}</span>
          </label>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        <div className="flex items-center gap-4">
          <div
            onClick={handleTriggerUpload}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative group cursor-pointer w-20 h-20 rounded-full border-2 overflow-hidden shrink-0 transition-all flex items-center justify-center ${
              isDragging
                ? 'border-primary bg-primary/10 ring-4 ring-primary/20'
                : value
                ? 'border-border/80 hover:border-primary'
                : 'border-dashed border-border/80 bg-muted/30 hover:bg-muted/60 hover:border-primary'
            }`}
          >
            {value ? (
              <>
                <img
                  src={value}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-medium">
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Change</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[9px] font-medium">Upload</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTriggerUpload}
                disabled={disabled || isProcessing}
                className="h-8 text-xs gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5 text-primary" />
                <span>{value ? 'Replace Photo' : 'Upload Photo'}</span>
              </Button>
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled}
                  className="h-8 text-xs text-muted-foreground hover:text-destructive gap-1 px-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </Button>
              )}
            </div>
            {helperText && <p className="text-[11px] text-muted-foreground">{helperText}</p>}
          </div>
        </div>
      </div>
    );
  }

  // Banner / Hero Cover Variant (Wide 21:9 or 16:6)
  if (variant === 'banner') {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>{label} {required && <span className="text-destructive">*</span>}</span>
          </label>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        <div
          onClick={handleTriggerUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group cursor-pointer w-full h-36 rounded-xl border-2 overflow-hidden transition-all flex items-center justify-center ${
            isDragging
              ? 'border-primary bg-primary/10 ring-4 ring-primary/20'
              : value
              ? 'border-border/80 hover:border-primary shadow-sm'
              : 'border-dashed border-border/80 bg-muted/20 hover:bg-muted/40 hover:border-primary'
          }`}
        >
          {value ? (
            <>
              <img
                src={value}
                alt="Banner Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleTriggerUpload}
                  className="h-8 text-xs gap-1.5 bg-background/90 hover:bg-background text-foreground"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Change Banner</span>
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="h-8 text-xs gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                Click to browse or drag & drop banner image
              </p>
              {helperText && (
                <p className="text-[11px] text-muted-foreground mt-0.5">{helperText}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default Thumbnail / Card Variant (16:9 or Standard Box)
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>{label} {required && <span className="text-destructive">*</span>}</span>
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />

      {value ? (
        <div className="relative group rounded-xl border border-border/80 overflow-hidden bg-muted/20">
          <div className="h-44 w-full overflow-hidden bg-muted/40 flex items-center justify-center">
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="p-2.5 bg-background/95 border-t border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Image Attached</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTriggerUpload}
                className="h-7 text-xs gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-7 text-xs text-muted-foreground hover:text-destructive gap-1 px-2"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={handleTriggerUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-5 transition-all text-center flex flex-col items-center justify-center ${
            isDragging
              ? 'border-primary bg-primary/10 ring-4 ring-primary/20'
              : 'border-border/80 bg-muted/20 hover:bg-muted/40 hover:border-primary/80'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-foreground">
              <span className="text-primary hover:underline">Click to upload photo</span> or drag and drop
            </p>
            {helperText && (
              <p className="text-[11px] text-muted-foreground">{helperText}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

