import { FilesOperations } from './files-operations.interface';

export class FilesOperationsMock implements FilesOperations {
  async fileExists() {
    return false;
  }

  async getFileContent() {
    return '""';
  }

  async updateFileContent() {
    return undefined;
  }
}
