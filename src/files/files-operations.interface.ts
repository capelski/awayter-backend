export interface FilesOperations {
  fileExists: (fileName: string) => Promise<boolean>;
  getFileContent: (fileName: string) => Promise<string>;
  updateFileContent: (fileName: string, content: string) => Promise<void>;
}
