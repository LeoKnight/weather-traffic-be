import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherModule } from './modules/weather/weather.module';
import { TrafficModule } from './modules/traffic/traffic.module';
import { CacheModule } from '@nestjs/cache-manager';
import { SearchRecordModule } from './modules/searchRecord/searchRecord.module';
import { AutheService } from './global-service/auth-service/auth.service';
import { UserModule } from './modules/user/user.module';
import { configService } from './global-service/config-service/config.service';
import { AuthMiddleware } from './middlewares/auth.middleware/auth.middleware';
import { Base64DecryptMiddleware } from './middlewares/base64.decrypt.middleware/base64.decrypt.middleware';
import { ExternalApiModule } from './modules/external-api/external-api.module';
import { join } from 'path';

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
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AutheService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, Base64DecryptMiddleware)
      .forRoutes('api/search');
    consumer
      .apply(AuthMiddleware, Base64DecryptMiddleware)
      .forRoutes('api/user');
  }
}
