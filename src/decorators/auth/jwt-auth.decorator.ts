import { SetMetadata } from '@nestjs/common';

export const REQUIRE_TOKEN = 'REQUIRE_TOKEN';
export const RequireToken = (r: boolean = true) =>
  SetMetadata(REQUIRE_TOKEN, r);
