import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService } from './services/api-config.service';
import { TypeormModule } from './infra/typeorm/typeorm.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeormModule,
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService, TypeormModule],
})
export class SharedModule {}
