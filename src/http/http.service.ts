/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { withRetry } from '../utils/utils';

@Injectable()
export class CustomHttpService {
  private requestQueue: (() => Promise<any>)[] = [];
  private isProcessing = false;
  private requestCount = 0;
  private lastRequestTime = Date.now();
  private readonly MAX_REQUESTS_PER_SECOND = 3;

  constructor(private readonly httpService: HttpService) {}

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - this.lastRequestTime;

      if (elapsedTime >= 1000) {
        this.requestCount = 0;
        this.lastRequestTime = currentTime;
      }

      if (this.requestCount >= this.MAX_REQUESTS_PER_SECOND) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      const request = this.requestQueue.shift();
      if (request) {
        this.requestCount++;
        await request();
      }
    }

    this.isProcessing = false;
  }

  private async enqueueRequest<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      void this.processQueue();
    });
  }

  private async makeRequest<T>(request: () => Promise<T>): Promise<T> {
    return withRetry(async () => {
      return this.enqueueRequest(request);
    });
  }

  async getResponse<T>(
    url: string,
    config?: AxiosRequestConfig,
    jsonPath?: string,
  ): Promise<T> {
    return this.makeRequest(async () => {
      const response = await firstValueFrom(
        this.httpService.get<T>(url, config),
      );
      const data = response.data as T;

      if (jsonPath) {
        return this.extractJson(data, jsonPath) as T;
      }

      return data;
    });
  }

  async postResponse<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig,
    jsonPath?: string,
  ): Promise<T> {
    return this.makeRequest(async () => {
      const response = await firstValueFrom(
        this.httpService.post(url, body, config),
      );
      const data = response.data as T;

      if (jsonPath) {
        return this.extractJson(data, jsonPath) as T;
      }

      return data;
    });
  }

  async getGraphQL<T>(
    url: string,
    query: string,
    variables?: Record<string, any>,
    jsonPath?: string,
  ): Promise<T> {
    return this.makeRequest(async () => {
      const response = await firstValueFrom(
        this.httpService.post(url, { query, variables }),
      );
      const data = response.data as T;

      if (jsonPath) {
        return this.extractJson(data, jsonPath) as T;
      }

      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: T }).data;
      }
      return data;
    });
  }

  private extractJson(data: any, jsonPath: string): any {
    const pathParts = jsonPath.split('.');
    let currentNode = data;

    for (const part of pathParts) {
      if (!currentNode || currentNode[part] === undefined) {
        return null;
      }
      if (typeof currentNode[part] === 'object' && currentNode[part] !== null) {
        currentNode = currentNode[part];
      } else {
        return null;
      }
    }

    return currentNode;
  }
}
