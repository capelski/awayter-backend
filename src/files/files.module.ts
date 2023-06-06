import { Logger, Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesOperationsProvider } from './files-operations.provider';

@Module({
  controllers: [FilesController],
  providers: [
    FilesOperationsProvider,
    {
      provide: Logger,
      useValue: new Logger('Files'),
    },
  ],
})
export class FilesModule {}
