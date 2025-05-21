import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => undefinedToNull(data)),
    )
  }
}

function undefinedToNull(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(undefinedToNull)
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, value === undefined ? null : undefinedToNull(value)])
    )
  }
  return obj
}