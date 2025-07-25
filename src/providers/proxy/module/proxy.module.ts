import { Module } from '@nestjs/common';
import { ProxyService } from '../service/proxy.service.js';
import { ProxyController } from '../controller/proxy.controller.js';
import { SharedModule } from '../../../shared/shared.module.js';

@Module({
  imports: [SharedModule],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
