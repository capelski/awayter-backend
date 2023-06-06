import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { FilesOperations } from './files-operations.interface';
import { FILES_OPERATIONS } from './files-operations.provider';
import { Request } from 'express';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller()
export class FilesController {
  constructor(
    @Inject(FILES_OPERATIONS) private filesOperations: FilesOperations,
  ) {}

  @Get('/get-file')
  @ApiOperation({ summary: 'Returns the content of the provided file name' })
  @ApiQuery({
    description: 'The name of the file',
    example: 'tenerife.json',
    name: 'fileName',
    required: true,
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Content of the file' })
  @ApiResponse({
    status: 400,
    description: "Missing file name or file doesn't exist",
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error retrieving the file content',
  })
  async getFileContent(@Req() req: Request) {
    const fileName = req.query.fileName as string;

    if (!fileName) {
      throw new BadRequestException({ message: 'Missing file name' });
    }

    const exists = await this.filesOperations.fileExists(fileName);
    if (!exists) {
      throw new BadRequestException({ message: "The file doesn't exist" });
    }

    try {
      const fileContent = await this.filesOperations.getFileContent(fileName);
      return JSON.parse(fileContent);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          message: `An unexpected error ocurred while retrieving the file ${fileName}`,
        },
        500,
      );
    }
  }

  @Post('/update-file')
  @ApiOperation({
    summary:
      "Updates the content of the provided file name or creates the file if it doesn't exist",
  })
  @ApiBody({
    required: true,
    examples: {
      default: {
        value: { fileName: 'tenerife.json', content: { json: 'object' } },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Successfully updated file' })
  @ApiResponse({
    status: 400,
    description: 'Missing file name or content',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error while updating the file',
  })
  async updateFileContent(@Req() req: Request) {
    const { fileName, content } = req.body;

    if (!fileName) {
      throw new BadRequestException({ message: 'Missing file name' });
    }

    if (!content) {
      throw new BadRequestException({ message: 'Missing file content' });
    }

    try {
      await this.filesOperations.updateFileContent(
        fileName,
        JSON.stringify(content),
      );
      return content;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          message: `An unexpected error ocurred while updating the file ${fileName}`,
        },
        500,
      );
    }
  }
}
