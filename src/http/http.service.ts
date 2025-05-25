/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CustomHttpService {
  constructor(private readonly httpService: HttpService) {}

  async getResponse<T>(
    url: string,
    config?: AxiosRequestConfig,
    jsonPath?: string,
  ): Promise<T> {
    console.log(`Fetching URL: ${url}`)

    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(url, config),
      );
      const data = response.data as T;

      if (jsonPath) {
        return this.extractJson(data, jsonPath) as T;
      }

      return data;
    } catch (error) {
      console.error(`Failed to get response: ${error}`)
      throw error;
    }
  }

  async postResponse<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig,
    jsonPath?: string,
  ): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, config),
      );
      const data = response.data as T;

      if (jsonPath) {
        return this.extractJson(data, jsonPath) as T;
      }

      return data;
    } catch (error) {
      console.error(`Failed to get post response: ${error}`)
      throw error;
    }
  }

  async getGraphQL<T>(
    url: string,
    query: string,
    variables?: Record<string, any>,
    jsonPath?: string,
  ): Promise<T> {
    try {
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
    } catch (error) {
      console.error(
        `Failed to fetch GraphQL response from ${url}:`,
        error,
      );
      throw error;
    }
  }

  private extractJson(data: any, jsonPath: string): any {
    const pathParts = jsonPath.split('.');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let currentNode = data;

    for (const part of pathParts) {
      if (!currentNode || currentNode[part] === undefined) {
        return null;
      }
      if (typeof currentNode[part] === 'object' && currentNode[part] !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        currentNode = currentNode[part];
      } else {
        return null;
      }
    }

    return currentNode;
  }
}
