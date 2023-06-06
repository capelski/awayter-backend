import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GcloudFilesService } from './gcloud-files.service';
import { LocalFilesService } from './local-files.service';

const STORAGE_MODE = 'STORAGE_MODE';
const GCLOUD_STORAGE_BUCKET = 'GCLOUD_STORAGE_BUCKET';
const LOCAL_STORAGE_FOLDER = 'LOCAL_STORAGE_FOLDER';

export const FILES_OPERATIONS = 'FilesOperations';

export const filesOperationsProviderCore = (
  mode?: string,
  bucket?: string,
  folder?: string,
) => {
  if (!mode || (mode !== 'gcloud' && mode !== 'local')) {
    throw new Error(
      `Missing or invalid "${STORAGE_MODE}" environment variable (value: "${mode}"). Please use "gcloud" or "local"`,
    );
  }

  const storageUnit = mode === 'gcloud' ? bucket : folder;

  if (!storageUnit) {
    throw new Error(
      mode === 'gcloud'
        ? `Missing "${GCLOUD_STORAGE_BUCKET}" environment variable`
        : `Missing "${LOCAL_STORAGE_FOLDER}" environment variable`,
    );
  }

  return mode === 'gcloud'
    ? new GcloudFilesService(storageUnit)
    : new LocalFilesService(storageUnit);
};

export const FilesOperationsProvider: Provider = {
  inject: [ConfigService],
  provide: FILES_OPERATIONS,
  useFactory: (configService: ConfigService) => {
    const mode = configService.get<string>(STORAGE_MODE);
    const bucket = configService.get<string>(GCLOUD_STORAGE_BUCKET);
    const folder = configService.get<string>(LOCAL_STORAGE_FOLDER);

    return filesOperationsProviderCore(mode, bucket, folder);
  },
};
