import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggingExceptionFilter } from './filter/error-handling-exception-filter';
import { SharedModule } from './shared/shared.module';
import { SampleModule } from './modules/sample/sample.module';

@Module({
  imports: [SharedModule, SampleModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: LoggingExceptionFilter,
    },
  ],
})
export class AppModule {}
