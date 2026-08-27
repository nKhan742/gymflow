export interface IFileMetadata {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

export interface IStorageProvider {
  upload(file: Express.Multer.File, folder?: string): Promise<IFileMetadata>;
  delete(filePath: string): Promise<boolean>;
}

export class LocalStorageProvider implements IStorageProvider {
  async upload(file: Express.Multer.File, folder = 'uploads'): Promise<IFileMetadata> {
    return {
      filename: file.filename || file.originalname,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `${folder}/${file.filename || file.originalname}`,
      url: `/static/${folder}/${file.filename || file.originalname}`,
    };
  }

  async delete(_filePath: string): Promise<boolean> {
    return true;
  }
}
