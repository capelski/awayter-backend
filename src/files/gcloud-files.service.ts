import { Storage } from '@google-cloud/storage';
import { FilesOperations } from './files-operations.interface';

export class GcloudFilesService implements FilesOperations {
  constructor(private bucketName: string) {}

  fileExists(fileName: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        const storage = new Storage();
        const bucket = storage.bucket(this.bucketName);
        const blob = bucket.file(fileName);
        blob.exists().then(([exists]) => resolve(exists));
      } catch (error) {
        reject(error);
      }
    });
  }

  getFileContent(fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        const storage = new Storage();
        const bucket = storage.bucket(this.bucketName);
        const blob = bucket.file(fileName);
        let content = '';
        blob
          .createReadStream()
          .on('data', (data) => (content += data))
          .on('end', () => resolve(content))
          .on('error', (e) => reject(e));
      } catch (error) {
        reject(error);
      }
    });
  }

  updateFileContent(fileName: string, fileContents: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const storage = new Storage();
        const bucket = storage.bucket(this.bucketName);
        const blob = bucket.file(fileName);

        blob
          .createWriteStream()
          .on('error', reject)
          .on('finish', resolve)
          .end(fileContents);
      } catch (error) {
        reject(error);
      }
    });
  }
}
