import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS RBAC API')
    .setDescription(
      'Complete NestJS Role-Based Access Control API with three different approaches:\n\n' +
        '1. **Example 1**: Role-Based Access Control\n' +
        '2. **Example 2**: Permission-Based Access Control\n' +
        '3. **Example 3**: Module-Based Permissions\n\n' +
        'Use the Bearer token authentication with test tokens provided in the console.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your bearer token (e.g., token-admin, token-manager, etc.)',
      },
      'bearer',
    )
    .addTag('Example 1 - Role-Based', 'Role-based access control endpoints')
    .addTag('Example 2 - Permission-Based', 'Permission-based access control endpoints')
    .addTag('Example 3 - Module-Based', 'Module-based permission endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

}
bootstrap();
