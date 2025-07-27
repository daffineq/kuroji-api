import { SetMetadata } from '@nestjs/common';

export const IGNORE_THROTTLER_KEY = 'ignoreThrottler';
export const IgnoreThrottler = () => SetMetadata(IGNORE_THROTTLER_KEY, true);
