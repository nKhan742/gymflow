export interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  variant?: 'avatar' | 'thumbnail' | 'banner' | 'card';
  className?: string;
  disabled?: boolean;
  required?: boolean;
  maxSizeMb?: number;
}

export type IImageUploadProps = ImageUploadProps;

