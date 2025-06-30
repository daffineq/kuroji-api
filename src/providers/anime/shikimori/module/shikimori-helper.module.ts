import { Module } from '@nestjs/common';
import { ShikimoriHelper } from '../utils/shikimori-helper.js';

@Module({
  providers: [ShikimoriHelper],
  exports: [ShikimoriHelper],
})
export class ShikimoriHelperModule {}
