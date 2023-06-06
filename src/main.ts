import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const openApiConfig = new DocumentBuilder()
    .setTitle('Awayter backend')
    .setDescription('Backend services for Awayter')
    .build();

  const openApiSpecs = SwaggerModule.createDocument(app, openApiConfig);

  SwaggerModule.setup('/', app, openApiSpecs);

  await app.listen(PORT);
}
bootstrap();
