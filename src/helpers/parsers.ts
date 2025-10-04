import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { ReleaseDate } from 'src/core/types';
import { BadRequestError } from './errors';

const parseString = (value: unknown): string | undefined => {
  if (value == null) {
    return undefined;
  }
  const string_ = String(value);
  return string_.length > 0 ? string_ : undefined;
};

const parseNumber = (value: unknown): number | undefined => {
  if (value == null) {
    return undefined;
  }
  const number_ = Number(value);
  return Number.isNaN(number_) ? undefined : number_;
};

const parseBoolean = (value: unknown): boolean | undefined => {
  if (value == null) {
    return undefined;
  }
  const boolean_ = Boolean(value);
  return boolean_ === true || boolean_ === false ? boolean_ : undefined;
};

const parseReleaseDate = (date: { year: number; month: number; day: number }): ReleaseDate => {
  return {
    year: date.year,
    month: date.month,
    day: date.day
  };
};

async function parseDto<T extends object>(
  dtoClass: new (...args: any[]) => T,
  input: Record<string, any>
): Promise<T> {
  const instance = plainToInstance(dtoClass, input, {
    enableImplicitConversion: true
  });

  try {
    await validateOrReject(instance, { whitelist: true, forbidNonWhitelisted: false });
    return instance;
  } catch (errors) {
    if (Array.isArray(errors) && errors[0] instanceof ValidationError) {
      const messages = errors
        .map((error: ValidationError) => {
          const constraints = error.constraints || {};
          return `${error.property}: ${Object.values(constraints).join(', ')}`;
        })
        .join('; ');
      throw new BadRequestError('Validation failed', messages);
    }
    throw errors;
  }
}

async function parseJson(request: any): Promise<any> {
  try {
    const text = await request.text();
    if (!text || text.trim() === '') {
      return {};
    }
    return JSON.parse(text);
  } catch (error) {
    return {};
  }
}

export { parseString, parseNumber, parseBoolean, parseReleaseDate, parseDto, parseJson };
