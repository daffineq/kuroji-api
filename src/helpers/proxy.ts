import axios from 'axios';
import * as http from 'http';
import * as https from 'https';
import { Config } from 'src/config/config';
import { Readable } from 'stream';

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

class Proxy {
  async fetchProxiedStream(
    url: string,
    customHeaders: Record<string, string> = {}
  ): Promise<{
    content: Buffer | Readable;
    headers: Record<string, string | undefined>;
    isStream: boolean;
  }> {
    const response = await axios.get<Readable>(url, {
      headers: customHeaders,
      responseType: 'stream',
      decompress: false,
      timeout: 10000,
      validateStatus: () => true, // we don't throw
      httpAgent,
      httpsAgent
    });

    // Response headers
    const headers = response.headers as Record<string, string | undefined>;
    const contentType = headers['content-type'] || '';

    const proxyHeaders = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    };

    ['content-length', 'content-disposition'].forEach((header) => {
      if (headers[header]) {
        proxyHeaders[header.charAt(0).toUpperCase() + header.slice(1)] = headers[header];
      }
    });

    if (contentType.includes('application/vnd.apple.mpegurl') || url.endsWith('.m3u8')) {
      const rawText = await this.streamToString(response.data);
      const baseUrl = url.slice(0, url.lastIndexOf('/') + 1);

      const rewritten = rawText
        .split('\n')
        .map((line) => {
          if (line.trim().startsWith('#') || line.trim() === '') return line;
          const full = new URL(line.trim(), baseUrl).toString();
          return `${Config.proxy_url}${encodeURIComponent(full)}`;
        })
        .join('\n');

      proxyHeaders['Content-Type'] = 'application/vnd.apple.mpegurl';

      return {
        content: Buffer.from(rewritten, 'utf-8'),
        headers: proxyHeaders,
        isStream: false
      };
    }

    return {
      content: response.data,
      headers: proxyHeaders,
      isStream: true
    };
  }

  private async streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => {
        if (Buffer.isBuffer(chunk)) {
          chunks.push(chunk);
        } else if (typeof chunk === 'string' || chunk instanceof Uint8Array) {
          chunks.push(Buffer.from(chunk));
        } else {
          reject(new Error('Unknown chunk type'));
        }
      });
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      stream.on('error', reject);
    });
  }
}

const proxy = new Proxy();

export default proxy;
