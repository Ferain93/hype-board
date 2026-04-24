import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://hype-board-sigma.vercel.app',
    ],
    methods: ['GET'],
  });

  // Vercel
  if (process.env.VERCEL === '1') {
    await app.init();
    return app;
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend corriendo en: http://localhost:${port}`);
  console.log(`Endpoint: http://localhost:${port}/api/videos`);
}

const appPromise = bootstrap();

// Handler que usa Vercel
export default async (req: any, res: any) => {
  const app = await appPromise;
  app!.getHttpAdapter().getInstance()(req, res);
};