import { filesOperationsProviderCore } from './files-operations.provider';
import { GcloudFilesService } from './gcloud-files.service';
import { LocalFilesService } from './local-files.service';

describe('filesOperationsProviderCore', () => {
  it('should throw an error when STORAGE_MODE is missing', () => {
    expect(() => filesOperationsProviderCore(undefined)).toThrow(
      /STORAGE_MODE/,
    );
  });

  it('should throw an error when STORAGE_MODE is invalid', () => {
    expect(() => filesOperationsProviderCore('invalid')).toThrow(
      /STORAGE_MODE/,
    );
  });

  it('should throw an error when STORAGE_MODE=gcloud and GCLOUD_STORAGE_BUCKET is missing', () => {
    expect(() => filesOperationsProviderCore('gcloud')).toThrow(
      /GCLOUD_STORAGE_BUCKET/,
    );
  });

  it('should throw an error when STORAGE_MODE=local and LOCAL_STORAGE_FOLDER is missing', () => {
    expect(() => filesOperationsProviderCore('local')).toThrow(
      /LOCAL_STORAGE_FOLDER/,
    );
  });

  it('should return an instance of GcloudFilesService when STORAGE_MODE=gcloud', () => {
    const filesOperations = filesOperationsProviderCore('gcloud', 'bucket');
    expect(filesOperations instanceof GcloudFilesService).toBe(true);
  });

  it('should return an instance of LocalFilesService when STORAGE_MODE=local', () => {
    const filesOperations = filesOperationsProviderCore(
      'local',
      undefined,
      'storage',
    );
    expect(filesOperations instanceof LocalFilesService).toBe(true);
  });
});
