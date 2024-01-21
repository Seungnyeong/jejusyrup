import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';

export function setUpSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API DOC')
    .setDescription('제주 시럽 도큐먼트')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme('v3');

  SwaggerModule.setup('api-doc', app, document, {
    customSiteTitle: '제주 시럽 API-DOCS',
    customfavIcon: '/static/squid.png',
    explorer: true,
    customCss: theme.getBuffer('dark'),
  });
}
