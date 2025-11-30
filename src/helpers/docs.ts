import { MiddlewareHandler } from 'hono';
import { describeRoute } from 'hono-openapi';

export function describeTags(tags: string[]): MiddlewareHandler {
  return describeRoute({
    tags
  });
}
