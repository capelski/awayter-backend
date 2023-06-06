/* eslint-disable @typescript-eslint/no-empty-function */
import { LoggerService } from '@nestjs/common';

export class LoggerMock implements LoggerService {
  log() {}
  error() {}
  warn() {}
}
