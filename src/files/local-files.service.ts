import { promises as fs } from 'fs';
import { join } from 'path';
import { FilesOperations } from './files-operations.interface';

/** Function to create the local folder in case it doesn't exist; fs.stat gets
 * data for a given path and throws an error in case it doesn't exist
 */
const createStorageFolder = async (path: string) => {
  try {
    await fs.stat(path);
  } catch {
    fs.mkdir(path);
  }
};

export class LocalFilesService implements FilesOperations {
  private readonly storagePath: string;

  constructor(storageFolder: string) {
    this.storagePath = join(__dirname, '..', '..', storageFolder);
    createStorageFolder(this.storagePath); // Run asynchronously on the background
  }

  async fileExists(fileName: string) {
    const filePath = join(this.storagePath, fileName);

    console.log('Checking file at', filePath, '...');

    let exists = false;
    try {
      const stat = await fs.stat(filePath);
      exists = stat.isFile();
    } catch {}

    console.log('File exists?', exists);

    return exists;
  }

  async getFileContent(fileName: string) {
    const filePath = join(this.storagePath, fileName);

    console.log('Reading file at', filePath, '...');

    const fileContent = await fs.readFile(filePath);
    const stringContents = fileContent.toString();

    console.log('Finished reading!', stringContents);

    return stringContents;
  }

  async updateFileContent(fileName: string, content: string) {
    const filePath = join(this.storagePath, fileName);

    console.log('Writing file at', filePath, '...');

    await fs.writeFile(filePath, content);

    console.log('Finished writing!', filePath);
  }
}
