import { Global, Module } from '@nestjs/common';
import { MockAdapter } from './mock-adapter';

@Global()
@Module({
  providers: [{ provide: 'AIAdapter', useClass: MockAdapter }],
  exports: ['AIAdapter'],
})
export class AiModule {}
