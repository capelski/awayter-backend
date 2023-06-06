import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesOperationsProvider } from './files-operations.provider';

@Module({
  controllers: [FilesController],
  providers: [FilesOperationsProvider],
})
export class FilesModule {}
