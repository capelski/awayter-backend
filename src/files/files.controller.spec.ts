import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FILES_OPERATIONS } from './files-operations.provider';
import { Request } from 'express';
import { BadRequestException, Logger } from '@nestjs/common';
import { LoggerMock } from '../logger.mock';
import { FilesOperationsMock } from './files-operations.mock';

describe('FilesController', () => {
  let controller: FilesController;
  const filesOperationsMock = new FilesOperationsMock();
  const loggerMock = new LoggerMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FILES_OPERATIONS,
          useValue: filesOperationsMock,
        },
        {
          provide: Logger,
          useValue: loggerMock,
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFileContent', () => {
    it('should throw an error when the fileName parameter is not provided', async () => {
      const promise = controller.getFileContent({
        query: {
          fileName: undefined,
        },
      } as unknown as Request);

      await expect(promise).rejects.toThrow(
        new BadRequestException({ message: 'Missing file name' }),
      );
    });

    it("should throw an error when the provided fileName doesn't exist", async () => {
      const promise = controller.getFileContent({
        query: {
          fileName: 'existing.no',
        },
      } as unknown as Request);

      await expect(promise).rejects.toThrow(
        new BadRequestException({ message: "The file doesn't exist" }),
      );
    });

    it('should deserialize and return the file content when the provided fileName exists', async () => {
      jest.spyOn(filesOperationsMock, 'fileExists').mockResolvedValue(true);
      jest
        .spyOn(filesOperationsMock, 'getFileContent')
        .mockResolvedValue('"JSON"');

      const fileContent = await controller.getFileContent({
        query: {
          fileName: 'existing.yes',
        },
      } as unknown as Request);

      expect(fileContent).toEqual('JSON');
    });

    it('should log to the console when an unexpected error occurs', async () => {
      const unexpectedError = new Error('Unexpected error');

      jest.spyOn(filesOperationsMock, 'fileExists').mockResolvedValue(true);
      jest
        .spyOn(filesOperationsMock, 'getFileContent')
        .mockRejectedValue(unexpectedError);

      const loggerSpy = jest.spyOn(loggerMock, 'error');

      await expect(
        controller.getFileContent({
          query: {
            fileName: 'existing.yes',
          },
        } as unknown as Request),
      ).rejects.toThrow();

      expect(loggerSpy).toHaveBeenCalledWith(unexpectedError);
    });
  });

  describe('updateFileContent', () => {
    it('should throw an error when the fileName parameter is not provided', async () => {
      const promise = controller.updateFileContent({
        body: {
          fileName: undefined,
        },
      } as unknown as Request);

      await expect(promise).rejects.toThrow(
        new BadRequestException({ message: 'Missing file name' }),
      );
    });

    it('should throw an error when the content parameter is not provided', async () => {
      const promise = controller.updateFileContent({
        body: {
          fileName: 'file.name',
          content: undefined,
        },
      } as unknown as Request);

      await expect(promise).rejects.toThrow(
        new BadRequestException({ message: 'Missing file content' }),
      );
    });

    it('should serialize the provided content and write it to the provided fileName', async () => {
      const updateSpy = jest.spyOn(filesOperationsMock, 'updateFileContent');

      const fileContent = await controller.updateFileContent({
        body: {
          fileName: 'file.name',
          content: 'content',
        },
      } as unknown as Request);

      expect(updateSpy).toHaveBeenCalledWith('file.name', '"content"');
      expect(fileContent).toEqual('content');
    });

    it('should log to the console when an unexpected error occurs', async () => {
      const unexpectedError = new Error('Unexpected error');

      jest
        .spyOn(filesOperationsMock, 'updateFileContent')
        .mockRejectedValue(unexpectedError);

      const loggerSpy = jest.spyOn(loggerMock, 'error');

      await expect(
        controller.updateFileContent({
          body: {
            fileName: 'file.name',
            content: 'content',
          },
        } as unknown as Request),
      ).rejects.toThrow();

      expect(loggerSpy).toHaveBeenCalledWith(unexpectedError);
    });
  });
});
