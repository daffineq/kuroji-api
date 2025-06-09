import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        const safe = JSON.parse(
          JSON.stringify(undefinedToNull(data)),
        ) as unknown;
        return convertDates(safe);
      }),
    );
  }
}

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

function undefinedToNull(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map((item) => undefinedToNull(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([key, value]) => [
        key,
        value === undefined ? null : undefinedToNull(value),
      ]),
    );
  }
  return obj;
}

function convertDates(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertDates(item));
  }

  if (obj !== null && typeof obj === 'object') {
    const newObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] =
        value instanceof Date ? value.toISOString() : convertDates(value);
    }
    return newObj;
  }

  return obj;
}
