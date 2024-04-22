import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherModule } from './modules/weather/weather.module';
import { TrafficModule } from './modules/traffic/traffic.module';
import { CacheModule } from '@nestjs/cache-manager';
import { SearchRecordModule } from './modules/searchRecord/searchRecord.module';
import { configService } from './global-service/config-service/config.service';
import { AuthMiddleware } from './middlewares/auth.middleware/auth.middleware';
import { ExternalApiModule } from './modules/external-api/external-api.module';
import { join } from 'path';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware/request-logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...configService.getTypeOrmConfig(),
      entities: [join(__dirname, '**', '**', '*.entity.{ts,js}')],
    }),
    WeatherModule,
    TrafficModule,
    SearchRecordModule,
    ExternalApiModule,
    CacheModule.register({
      ttl: 5 * 60 * 60, // 5 minutes
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('api/weather');
    consumer.apply(AuthMiddleware).forRoutes('api/traffic');
  }
}
