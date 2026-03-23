import { sleep } from 'bun';
import logger from 'src/helpers/logger';

const userAgents = [
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/37.0.2062.94 Chrome/37.0.2062.94 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
  'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/8.0.8 Safari/600.8.9',
  'Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4',
  'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240',
  'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0',
  'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko',
  'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',
  'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:40.0) Gecko/20100101 Firefox/40.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/7.1.8 Safari/537.85.17',
  'Mozilla/5.0 (iPad; CPU OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H143 Safari/600.1.4',
  'Mozilla/5.0 (iPad; CPU OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F69 Safari/600.1.4'
];

const getRandomUserAgent = (): string => {
  return (
    userAgents[Math.floor(Math.random() * userAgents.length)] ??
    'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0'
  );
};

export interface RequestResponse<T> {
  data: T | null;
  error: Error | null;
  response: Response | null;
}

export interface KurojiOptions extends RequestInit {
  jsonPath?: string;
}

interface RateLimitInfo {
  remaining: number;
  reset: number;
  retryAfter: number;
}

export function extractJson(data: unknown, jsonPath: string): unknown {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const pathParts = jsonPath.split('.');
  let currentNode: Record<string, unknown> = data as Record<string, unknown>;

  for (const part of pathParts) {
    if (!currentNode || typeof currentNode !== 'object' || !(part in currentNode)) {
      return null;
    }

    if (typeof currentNode[part] === 'object' && currentNode[part] !== null) {
      currentNode = currentNode[part] as Record<string, unknown>;
    } else {
      return currentNode[part];
    }
  }

  return currentNode;
}

export class KurojiClient {
  private baseUrl?: string;
  private rateLimitInfo: RateLimitInfo = {
    remaining: Number.POSITIVE_INFINITY,
    reset: 0,
    retryAfter: 60
  };

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl;
  }

  private async handleRateLimit(response: Response): Promise<void> {
    const remaining = Number.parseInt(response.headers.get('x-ratelimit-remaining') || 'Infinity');
    const reset = Number.parseInt(response.headers.get('x-ratelimit-reset') || '0');
    const retryAfter = Number.parseInt(response.headers.get('retry-after') || '60');

    this.rateLimitInfo = {
      remaining,
      reset,
      retryAfter: retryAfter === 0 ? 60 : retryAfter
    };
  }

  private async handleRequest<T>(
    method: string,
    url: string,
    options?: KurojiOptions
  ): Promise<RequestResponse<T>> {
    const response: RequestResponse<T> = {
      data: null,
      error: null,
      response: null
    };

    const finalUrl = this.baseUrl ? `${this.baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}` : url;

    try {
      let attempt = 0;
      const maxAttempts = 3;

      while (attempt < maxAttempts) {
        if (this.rateLimitInfo.remaining <= 0) {
          const now = Math.floor(Date.now() / 1000);
          const waitTime = Math.max(this.rateLimitInfo.reset - now, 0);
          logger.warn(`[rate-limit] sleeping ${waitTime}s due to 0 remaining [${this.baseUrl}${url}]`);
          await sleep(waitTime * 1000);
        }

        const apiResponse = await fetch(finalUrl, {
          method,
          ...options,
          headers: {
            'User-Agent': getRandomUserAgent(),
            'Content-Type': 'application/json',
            'x-requested-with': 'XMLHttpRequest',
            ...options?.headers
          },
          signal: AbortSignal.timeout(20000)
        });

        await this.handleRateLimit(apiResponse);

        if (apiResponse.status === 429) {
          logger.warn(`[rate-limit] 429 sleeping ${this.rateLimitInfo.retryAfter}s`);

          await sleep(this.rateLimitInfo.retryAfter * 1000);

          attempt++;
          continue;
        }

        if (!apiResponse.ok) {
          throw new Error(`Request failed with status ${apiResponse.status} ${apiResponse.statusText}`);
        }

        const textResponse = await apiResponse.text();
        try {
          const jsonData = JSON.parse(textResponse) as unknown;

          if (options?.jsonPath) {
            response.data = extractJson(jsonData, options.jsonPath) as T;
          } else {
            response.data = jsonData as T;
          }
        } catch {
          response.data = textResponse as T;
        }

        response.response = apiResponse;

        return response;
      }

      throw new Error('Too many retries');
    } catch (err) {
      if (err instanceof Error) {
        response.error = err;
      }

      return response;
    }
  }

  async get<T>(url: string, options?: KurojiOptions): Promise<RequestResponse<T>> {
    return this.handleRequest<T>('GET', url, options);
  }

  async post<T>(url: string, options?: KurojiOptions): Promise<RequestResponse<T>> {
    return this.handleRequest<T>('POST', url, options);
  }

  async put<T>(url: string, options?: KurojiOptions): Promise<RequestResponse<T>> {
    return this.handleRequest<T>('PUT', url, options);
  }

  async delete<T>(url: string, options?: KurojiOptions): Promise<RequestResponse<T>> {
    return this.handleRequest<T>('DELETE', url, options);
  }

  async patch<T>(url: string, options?: KurojiOptions): Promise<RequestResponse<T>> {
    return this.handleRequest<T>('PATCH', url, options);
  }
}
