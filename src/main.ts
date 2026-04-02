import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { AppDataSource } from './config/datasource';
declare const module: any;

async function bootstrap() {
  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
      console.log('listening on port ' + (process.env.PORT ?? 3000));
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
